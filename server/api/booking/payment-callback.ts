import { defineEventHandler, createError } from "h3";
import knex from "~/server/utils/knex";
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

interface WebhookBody {
  id: string;
  purchase_id: string;
  status: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<WebhookBody>(event);
    const signature = getHeader(event, WEBHOOK_SIGNATURE_HEADER);

    // Verify webhook signature
    if (!signature || !CHIP_SECRET_KEY) {
      throw createError({
        statusCode: 400,
        message: "Invalid webhook signature"
      });
    }

    // Verify signature using raw body
    const rawBody = JSON.stringify(body);
    if (!verifyWebhookSignature(rawBody, signature)) {
      throw createError({
        statusCode: 400,
        message: "Webhook signature verification failed"
      });
    }

    // Get booking details with status check
    const [booking] = await knex("booking")
      .select("id", "status", "user_phoneno", "payment_ref_number", "user_fullname", "session_date", "session_time", "payment_amount")
      .where("payment_ref_number", body.purchase_id)
      .whereNot("status", STATUS_MAP[body.status as keyof typeof STATUS_MAP] || 4)
      .limit(1);

    if (!booking) {
      return { 
        success: true,
        message: "Booking already processed or not found"
      };
    }

    // Update booking status
    const newStatus = STATUS_MAP[body.status as keyof typeof STATUS_MAP] || 4;
    await knex("booking")
      .where("id", booking.id)
      .update({
        status: newStatus,
        payment_status: body.status,
        payment_date: new Date(),
        updated_at: new Date(),
      });

    // Log status transition
    await knex("booking_status_log").insert({
      booking_id: booking.id,
      old_status: booking.status,
      new_status: newStatus,
      payment_status: body.status,
      created_at: new Date(),
    });

    // Send notifications based on status
    if (body.status === "paid") {
      await sendWhatsAppNotification(
        booking.user_phoneno,
        booking.payment_ref_number,
        "customer",
        booking.user_fullname,
        booking.session_date,
        booking.session_time
      );
    }

    return { 
      success: true,
      message: `Payment ${body.status} processed successfully`
    };
  } catch (error: any) {
    console.error("Error in payment callback:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});
