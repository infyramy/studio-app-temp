import { H3Event } from "h3";
import crypto from "crypto";
import knex from "../../utils/knex";
import { sendWhatsAppNotification } from "../../utils/whatsapp";
import { createCalendarEvent } from "../../utils/calendar";

const CHIP_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAm/BhBBDwf50W2V6UyMVe
5cUASSXnRcrczBJLnVQk9iV1Vw0ZoDqtC3g988hVnKmHwgnoacdLZULGZMjnacXE
8/h5h0qka4v6AMCMczbXChjxyAjpgdz0bQ03OqHie26gIj6/7MiJqv3mv/fq5ciU
nRGW79i3uriV70gqpJgV2zphayt/xhAO5JSjpJnSKT0AbXMvaiXlJJkDItIdJJ+A
si0hRGY7CNlqMtjp/KnGCQ01zNU6mfUnJkBQau4ZZMxPMtlYRR/0rrpqUFwZNzMt
GWklpS5/GbQTRLjj2jgJOJCmRqSstR/1EaIFatfBHmYd0JCjLz3z/8f2pHbaas+j
zD03/kODr14EsOudXRzGOn5YbBSX1Md+Cmdzrep7ULR5m6CATrXQTo+Un08K5veS
/v+aMcHXTnO8Snp+eu+iOijJShBCTCJCA+NCIF5hPFCmOO0LNVI2GNAQkrjVoneE
fye6WoNbEAlxnFOys5JKK58kkehsbdobrZbqIqWuJJSnAgMBAAE=
-----END PUBLIC KEY-----`;

function verifySignature(payload: Buffer | string, signature: string): boolean {
  try {
    // Calculate SHA256 digest of the raw body buffer
    const digest = crypto.createHash("sha256").update(payload).digest();

    // Verify the signature against the digest using RSA PKCS#1 v1.5
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(digest);

    return verify.verify(
      {
        key: CHIP_PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(signature, "base64")
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    console.log("------- Payment callback received -------");

    const signature = event.headers.get("X-Signature");
    if (!signature) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing signature",
      });
    }

    console.log("Signature:", signature);

    // Get raw body buffer for signature verification
    const rawBody = await readRawBody(event);
    if (!rawBody) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing request body",
      });
    }

    // Parse body for processing
    const body = JSON.parse(rawBody.toString());
    console.log("Body status:", body.status);
    console.log("Raw body length:", rawBody.length);

    // Verify webhook signature
    // if (!verifySignature(rawBody, signature)) {
    //   console.error("Signature verification failed");
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: "Invalid signature",
    //   });
    // }

    // Extract payment details
    const { id: chipPaymentId, reference, status } = body;
    const bookingId = reference.replace("BOOKING-", "");

    // Get the booking
    const booking = await knex("booking")
      .select(
        "booking.id as booking_id",
        "booking.user_fullname as user_fullname",
        "booking.user_email as user_email",
        "booking.user_phoneno as user_phoneno",
        "booking.session_date as session_date",
        "booking.session_time as session_time",
        "booking.payment_ref_number as ref",
        "booking.payment_type as payment_type",
        "theme.title as theme",
        "booking.number_of_pax as number_of_pax",
        "referral.referral as referral_code"
      )
      .leftJoin("theme", "booking.theme", "theme.id")
      .leftJoin("referral", "booking.referral", "referral.id")
      .where("booking.id", bookingId)
      .first();

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: "Booking not found",
      });
    }

    // Map CHIP status to booking status
    let bookingStatus;
    switch (status) {
      case "paid":
        bookingStatus = booking.payment_type === 1 ? 3 : 2; // 3 = Paid, 2 = Deposit Paid
        break;
      case "failed":
        bookingStatus = 4; // Failed
        break;
      case "cancelled":
        bookingStatus = 5; // Cancelled
        break;
      default:
        bookingStatus = 1; // Pending
    }

    // If payment is successful, send notifications
    if (status === "paid") {
      // Get existing payment record
      const existingPayment = await knex("booking")
        .select("chip_purchase_id")
        .where("id", bookingId)
        .first();

      // Only send notifications if this is a new payment ID
      if (existingPayment?.chip_purchase_id !== chipPaymentId) {
        // Get all config values in a single query
        const configValues = await knex("config")
          .select("code", "value")
          .whereIn("code", [
            "waha_endpoint",
            "admin_phoneno",
            "waze_url",
            "google_maps_url"
          ]);

        // Convert to object for easier access
        const config = Object.fromEntries(
          configValues.map(row => [row.code, row.value])
        );

        if (config.admin_phoneno) {
          await sendWhatsAppNotification(
            "admin",
            config.admin_phoneno,
            booking,
            config.waha_endpoint,
            config.waze_url,
            config.google_maps_url
          );
        }

        // Send whatsapp notification to user
        const userPhoneNumber = booking.user_phoneno;
        if (userPhoneNumber) {
          await sendWhatsAppNotification(
            "customer",
            userPhoneNumber,
            booking,
            config.waha_endpoint,
            config.waze_url,
            config.google_maps_url
          );
        }

        // Create calendar event
        console.log(
          "----------------------- CREATE CALENDAR EVENT START -----------------------"
        );

        const calendarResult = await createCalendarEvent(booking);
        console.log(
          "----------------------- CREATE CALENDAR EVENT END -----------------------"
        );

        if (!calendarResult.success) {
          console.error(
            "Failed to create calendar event:",
            calendarResult.error
          );
        }

        // Update booking status
        await knex("booking").where("id", bookingId).update({
          status: bookingStatus,
          chip_purchase_id: chipPaymentId,
          payment_date: new Date(),
        });
      }
    }

    console.log("------- Payment callback received successfully -------");

    return {
      status: "success",
      message: `Payment ${status}, booking updated successfully`,
      data: {
        booking_id: bookingId,
        payment_status: status,
        booking_status: bookingStatus,
      },
    };
  } catch (error: any) {
    console.error("Payment callback error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal server error",
    });
  }
});
