import knex from "../../utils/knex";
import { defineEventHandler, readBody, createError } from "h3";
import crypto from 'crypto';
import dayjs from "dayjs";

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

// Helper functions for WhatsApp notifications
function formatNumber(number: number): string {
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatTime(timeStr: string): string {
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-MY", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMalayDate(date: string): string {
  const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const d = dayjs(date);
  return `${days[d.day()]}, ${d.format("DD MMMM YYYY")}`;
}

function formatWhatsAppMessage(text: string): string {
  return text.replace(/([.!?,])\s+/g, `$1\u200B `);
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateTyping(
  wahaEndpoint: string,
  chatId: string,
  message: string
) {
  try {
    await fetch(`${wahaEndpoint}/api/startTyping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    });

    const baseDelay = 500;
    const charDelay = Math.floor(Math.random() * 100) + 100;
    const typingDuration = Math.min(
      baseDelay + message.length * charDelay,
      5000
    );

    await delay(typingDuration);

    await fetch(`${wahaEndpoint}/api/stopTyping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    });
  } catch (error) {
    console.error("Error simulating typing:", error);
  }
}

async function sendWhatsAppNotification(
  phone: string,
  ref: string,
  type: string
) {
  try {
    console.log("Sending WhatsApp notification to:", phone);
    const chatId = `${phone}@c.us`;
    console.log("Chat ID:", chatId);

    // Get booking details
    const booking = await knex("booking")
      .select(
        "booking.*",
        "theme.title as theme_title",
        "referral.referral as referral_code"
      )
      .leftJoin("theme", "booking.theme", "theme.id")
      .leftJoin("referral", "booking.referral", "referral.id")
      .where("payment_ref_number", ref)
      .first();

    const formattedAmount = formatNumber(booking.payment_total);
    const formattedDate = formatMalayDate(booking.session_date);
    const formattedTime = formatTime(booking.session_time);

    const wahaEndpoint = await knex("config")
      .select("value")
      .where("code", "waha_endpoint")
      .first();

    const studioName = await knex("config")
      .select("value")
      .where("code", "company_name")
      .first();

    const wazeUrl = await knex("config")
      .select("value")
      .where("code", "waze_url")
      .first();

    const googleMapsUrl = await knex("config")
      .select("value")
      .where("code", "google_maps_url")
      .first();

    // Mark chat as seen first
    await fetch(`${wahaEndpoint.value}/api/sendSeen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    });

    // Initial delay before starting conversation
    await delay(1000);

    // Single message with previous formatting
    let message = "";
    if (type === "admin") {
      message =
        `*Payment Confirmed!*\n\n` +
        `Reference: *${ref}*\n` +
        `Customer: *${booking.user_fullname}*\n` +
        `Phone: *${booking.user_phoneno}*\n` +
        `Email: *${booking.user_email}*\n` +
        `Session Date: *${formattedDate}*\n` +
        `Session Time: *${formattedTime}*\n` +
        `Amount Paid: *RM ${formattedAmount}*\n\n` +
        `${
          booking.referral_code
            ? `Referral: *${booking.referral_code}*\n\n`
            : ""
        }` +
        `The customer has completed their payment and the booking is confirmed.\n\n` +
        `_Thank you._`;
    } else {
      message =
        `*Tempahan Anda Telah Disahkan!*\n` +
        `_${studioName.value}_\n\n` +
        `Terima kasih, ${booking.user_fullname}\n\n` +
        `*Butiran Tempahan Anda:*\n` +
        `No.​ Rujukan: *${ref}*\n` +
        `Tema: *${booking.theme_title}*\n` +
        `Pax: *${booking.number_of_pax} orang*\n` +
        `Tarikh Sesi: *${formattedDate}*\n` +
        `Masa Sesi: *${formattedTime}*\n\n` +
        `Jumlah Bayaran: *RM ${formattedAmount}*\n` +
        `${
          booking.referral_code
            ? `Referral: *${booking.referral_code}*\n\n`
            : ""
        }` +
        `Pembayaran anda telah diterima. Sila tiba 15 minit awal sebelum sesi bermula.\n\n` +
        `*Lokasi:*\n` +
        `${wazeUrl ? `🚗 Waze: ${wazeUrl.value}` : ""}\n` +
        `${googleMapsUrl ? `📍 Google Maps: ${googleMapsUrl.value}` : ""}\n\n` +
        `Jika anda mempunyai sebarang pertanyaan, sila hubungi kami di ${phone}\n\n` +
        `_Terima kasih dan kami tunggu kehadiran anda!_`;
    }

    const formattedMessage = formatWhatsAppMessage(message);

    // Simulate typing
    await simulateTyping(wahaEndpoint.value, chatId, formattedMessage);

    // Send the message
    const response = await fetch(`${wahaEndpoint.value}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        chatId,
        text: formattedMessage,
        session: "default",
        reply_to: "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    console.log(`Message sent to ${phone}:`, response.status);
    console.log("Message sent successfully to:", phone);
    return true;
  } catch (error) {
    console.log("Error send whatsapp:", error);
    return false;
  }
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

    // Verify the payment data
    if (!body.id) {
      throw createError({
        statusCode: 400,
        message: "Invalid payment data",
      });
    }

    // Find the booking with this CHIP purchase ID
    const booking = await knex("booking")
      .where("chip_purchase_id", body.id)
      .first();

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: "Booking not found for this payment",
      });
    }

    // Update the booking status based on payment status
    const status = body.status;
    let bookingStatus = 1; // Default to pending

    if (status === "paid") {
      // Payment successful
      bookingStatus = booking.payment_type === 1 ? 3 : 2; // 3 = Full payment, 2 = Partial payment (deposit)
      
      // Log the status change
      await knex("booking_status_log").insert({
        booking_id: booking.id,
        status: bookingStatus,
        remarks: `Payment completed via CHIP (${body.id})`,
        created_date: new Date(),
      });

      // Update the booking
      await knex("booking")
        .where("id", booking.id)
        .update({
          status: bookingStatus,
          payment_date: new Date(),
        });

      // Send WhatsApp notifications ONLY after successful payment
      try {
        // Get admin phone number
        const adminPhoneNumber = await knex("config")
          .select("value")
          .where("code", "admin_phoneno")
          .first();

        // Send notification to admin
        if (adminPhoneNumber?.value) {
          await sendWhatsAppNotification(
            adminPhoneNumber.value,
            booking.payment_ref_number,
            "admin"
          );
        }

        // Send notification to customer
        if (booking.user_phoneno) {
          await sendWhatsAppNotification(
            booking.user_phoneno,
            booking.payment_ref_number,
            "customer"
          );
        }
      } catch (notifyError) {
        console.error("Failed to send success notifications:", notifyError);
        // Continue despite notification failure
      }
    } else if (status === "refunded" || status === "failed") {
      // Payment failed or refunded
      bookingStatus = 4; // Failed
      
      // Log the status change
      await knex("booking_status_log").insert({
        booking_id: booking.id,
        status: bookingStatus,
        remarks: `Payment ${status} via CHIP (${body.id})`,
        created_date: new Date(),
      });

      // Update the booking status
      await knex("booking")
        .where("id", booking.id)
        .update({
          status: bookingStatus,
        });
    }

    return {
      success: true,
      message: "Payment callback processed successfully",
    };
  } catch (error: any) {
    console.error("Error processing payment callback:", error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to process payment callback",
    });
  }
});
