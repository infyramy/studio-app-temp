import { defineEventHandler, createError } from "h3";
import knex from "~/server/utils/knex";
import { redis } from "~/server/utils/redis";
import { sendWhatsAppNotification } from "~/server/utils/whatsapp";
import crypto from 'crypto';

const CHIP_SECRET_KEY = process.env.CHIP_SECRET_KEY;
const WEBHOOK_SIGNATURE_HEADER = 'x-chip-signature';

// Status mapping
const STATUS_MAP = {
  paid: 3,
  failed: 4,
  expired: 4,
  refunded: 5,
  partially_paid: 2
} as const;

// Verify CHIP webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', CHIP_SECRET_KEY || '');
    const calculatedSignature = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const signature = getHeader(event, WEBHOOK_SIGNATURE_HEADER);
    const rawBody = await readRawBody(event);

    // Verify webhook signature
    if (!signature || !CHIP_SECRET_KEY || !rawBody) {
      throw createError({
        statusCode: 400,
        message: "Missing required webhook data",
      });
    }

    if (!verifyWebhookSignature(rawBody.toString(), signature)) {
      throw createError({
        statusCode: 401,
        message: "Invalid webhook signature",
      });
    }

    const purchaseId = body.purchase_id;
    if (!purchaseId) {
      throw createError({
        statusCode: 400,
        message: "Purchase ID is required",
      });
    }

    // Check if webhook was already processed
    const processedWebhook = await redis.get(`webhook:${purchaseId}`);
    if (processedWebhook) {
      return { success: true, message: "Webhook already processed" };
    }

    // Get booking details with minimal fields
    const [booking] = await knex("booking")
      .select("id", "phone", "receipt_number", "customer_name", "date", "time", "location", "payment_amount")
      .where("payment_ref_number", purchaseId)
      .limit(1);

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    // Update booking status with minimal fields
    const newStatus = STATUS_MAP[body.status as keyof typeof STATUS_MAP] || 4;
    await knex("booking")
      .where("id", booking.id)
      .update({
        status: newStatus,
        payment_status: body.status,
        payment_date: new Date(),
      });

    // Update status cache immediately
    await redis.set(`payment_status:${purchaseId}`, body.status, "EX", 600); // 10 minutes

    // Mark webhook as processed
    await redis.set(`webhook:${purchaseId}`, "processed", "EX", 86400); // 24 hours

    // Handle notifications asynchronously
    if (body.status === "paid") {
      // Get config values from cache
      const [companyName, companyPhone, companyEmail] = await Promise.all([
        redis.get("config:company_name"),
        redis.get("config:company_phone"),
        redis.get("config:company_email")
      ]);

      // Send notifications without waiting
      Promise.all([
        sendWhatsAppNotification(
          booking.phone,
          booking.receipt_number,
          "customer",
          {
            companyName: companyName || "Studio Raya 2025",
            companyPhone: companyPhone || "",
            companyEmail: companyEmail || "",
            bookingId: booking.id,
            customerName: booking.customer_name,
            date: booking.date,
            time: booking.time,
            location: booking.location,
            amount: booking.payment_amount,
          }
        ),
        sendWhatsAppNotification(
          companyPhone || "",
          booking.receipt_number,
          "admin"
        )
      ]).catch(error => {
        console.error("Notification error:", error);
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Payment callback error:", error);
    throw error;
  }
});
