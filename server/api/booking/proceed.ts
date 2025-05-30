import knex from "../../utils/knex";
import { H3Event } from "h3";
import dayjs from "dayjs";

interface CustomError extends Error {
  statusCode?: number;
}

interface BookingFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  source: string;
  termsAccepted: boolean;

  // Session Details
  theme: number;
  theme_price: number;
  theme_deposit: number;
  date: string;
  time: string;
  number_of_pax: number;
  add_ons: { id: number; quantity: number }[];

  // Payment Details
  payment_type: number; // 1 = full, 2 = deposit
  payment_method: number; // 1 = fpx, 2 = cc
}

interface BookingRequest {
  date: string;
  time: string;
  theme: number;
  number_of_pax: number;
  add_ons: Array<{
    id: number;
    quantity: number;
  }>;
  name: string;
  email: string;
  phone: string;
  source: string;
  payment_type: number; // 1 = full, 2 = deposit
  payment_method: number; // 1 = fpx
  payment_amount: number;
  termsAccepted: boolean;
  referral: string;
}

// Validate date format (YYYY-MM-DD)
function isValidDate(dateStr: string): boolean {
  console.log("Validating date:", dateStr);

  // Check if date string exists
  if (!dateStr) {
    console.log("Date string is empty");
    return false;
  }

  // First, try to format the date if it's in a different format
  let formattedDate = dateStr;
  if (dateStr.includes("T")) {
    formattedDate = dateStr.split("T")[0];
    console.log("Formatted date from ISO:", formattedDate);
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(formattedDate)) {
    console.log("Date doesn't match YYYY-MM-DD format");
    return false;
  }

  const date = new Date(formattedDate);
  if (isNaN(date.getTime())) {
    console.log("Invalid date object");
    return false;
  }

  // Check if date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log("Date to validate:", date.toISOString());
  console.log("Today's date:", today.toISOString());

  return date >= today;
}

// Validate time format (HH:mm)
function isValidTime(timeStr: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeStr);
}

// Generate receipt number
function generateReceiptNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `RCP${timestamp}${random}`;
}

// Add this function at the top with other utility functions
/**
 * Retry a function with exponential backoff
 */
async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * backoff, backoff);
  }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<BookingRequest>(event);
    console.log("Booking Request:", body);

    // Validate the request
    if (
      !body.date ||
      !body.time ||
      !body.theme ||
      !body.name ||
      !body.email ||
      !body.phone
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

    // Check if the theme is valid
    const themeData = await knex("theme").where("id", body.theme).first();
    if (!themeData) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid theme",
      });
    }

    // Helper function to convert date to Malaysia timezone
    function toMalaysiaTime(dateStr: string): Date {
      const date = new Date(dateStr);
      return new Date(date.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours for Malaysia timezone
    }

    // Get theme's pax prices and date-specific prices
    const [paxPrices, dateSpecificPrices] = await Promise.all([
      knex("theme_pax_prices").where("theme", body.theme),
      knex("theme_date_specific_prices").where("theme", body.theme),
    ]);

    // Calculate base price based on price type
    let basePrice = 0;
    if (themeData.price_type === 1) {
      // Fixed price
      basePrice = themeData.price;
    } else if (themeData.price_type === 2) {
      // Pax-based pricing
      const applicablePaxPrice = paxPrices.find(
        (p) =>
          body.number_of_pax >= p.min_pax && body.number_of_pax <= p.max_pax
      );
      if (!applicablePaxPrice) {
        throw createError({
          statusCode: 400,
          statusMessage:
            "No applicable price found for the given number of pax",
        });
      }
      basePrice = applicablePaxPrice.price;
    }

    // Get configuration values
    const [chargePerPax, maxFreePax] = await Promise.all([
      knex("config").select("value").where("code", "charge_per_pax").first(),
      knex("config").select("value").where("code", "max_free_pax").first(),
    ]);

    // Check for date-specific price adjustment
    let datePriceAdjustment = 0;
    if (dateSpecificPrices?.length > 0) {
      const bookingDate = toMalaysiaTime(body.date);
      const applicableDatePrice = dateSpecificPrices.find((p) => {
        const startDate = toMalaysiaTime(p.start_date);
        const endDate = toMalaysiaTime(p.end_date);
        return bookingDate >= startDate && bookingDate <= endDate;
      });

      if (applicableDatePrice) {
        if (applicableDatePrice.price_type === 1) {
          // Fixed amount adjustment
          datePriceAdjustment = applicableDatePrice.amount;
        } else if (applicableDatePrice.price_type === 2) {
          // Percentage adjustment
          datePriceAdjustment = (basePrice * applicableDatePrice.amount) / 100;
        }
      }
    }

    // Calculate add-ons total
    let addons = [];
    let addonsTotal = 0;
    if (body.add_ons?.length > 0) {
      for (const addon of body.add_ons) {
        const addonData = await knex("addon").where("id", addon.id).first();
        if (!addonData) {
          throw createError({
            statusCode: 400,
            statusMessage: "Invalid add-on",
          });
        }
        addons.push({
          id: addonData.id,
          qty: addon.quantity,
          price: addonData.price,
        });
        addonsTotal += addonData.price * addon.quantity;
      }
    }

    // Calculate extra pax charges
    let extraPaxCharge = 0;
    if (body.number_of_pax > parseInt(maxFreePax.value)) {
      extraPaxCharge =
        (body.number_of_pax - parseInt(maxFreePax.value)) *
        parseInt(chargePerPax.value);
    }

    // Calculate subtotal before adjustments
    const subtotalBeforeAdjustments = basePrice + addonsTotal;

    // Calculate total payment including all components
    const paymentTotal =
      subtotalBeforeAdjustments + datePriceAdjustment + extraPaxCharge;

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();
    // console.log("Receipt Number:", receiptNumber);
    let updatedReferral = null;
    // Check referral if exist
    if (body.referral) {
      const referralData = await knex("referral")
        .where("referral", body.referral)
        .where("status", 1)
        .first();
      if (referralData) updatedReferral = referralData.id;
    }

    // Create the booking with pending status
    const [bookingId] = await knex("booking").insert({
      user_fullname: body.name,
      user_email: body.email,
      user_phoneno: body.phone,
      user_source: body.source,
      session_date: body.date,
      session_time: body.time,
      theme: body.theme,
      theme_price: basePrice,
      theme_surcharge_type: dateSpecificPrices?.[0]?.price_type || null,
      theme_surcharge_amount: datePriceAdjustment,
      number_of_pax: body.number_of_pax,
      number_of_extra_pax:
        body.number_of_pax > parseInt(maxFreePax.value)
          ? body.number_of_pax - parseInt(maxFreePax.value)
          : 0,
      addon: addons.length > 0 ? JSON.stringify(addons) : null,
      frame_status: addons.length > 0 ? 1 : 0,
      payment_ref_number: receiptNumber,
      payment_type: body.payment_type,
      payment_method: body.payment_method,
      payment_deposit: themeData.deposit,
      payment_amount: body.payment_method === 1 ? body.payment_amount : 0,
      payment_addon_total: addonsTotal,
      payment_total: paymentTotal,
      payment_extra_pax: extraPaxCharge,
      status: 1, // Pending
      session_status: 1, // Pending
      created_date: new Date(),
      referral: updatedReferral,
    });
    // console.log("Booking ID:", bookingId);

    if (body.payment_method === 1) {
      // CHIP Payment
      // Initialize CHIP payment

      const CHIP_SECRET_KEY = await knex("config")
        .select("value")
        .where("code", "chip_key")
        .first();

      const CHIP_BRAND_ID = await knex("config")
        .select("value")
        .where("code", "chip_brand_id")
        .first();

      const PAYMENT_METHODS = await knex("config")
        .select("value")
        .where("code", "chip_active_payment_methods")
        .first();

      try {
        console.log("CHIP Secret Key:", CHIP_SECRET_KEY.value);
        console.log("CHIP Brand ID:", CHIP_BRAND_ID.value);

        // Convert comma-separated payment methods to array
        const methods = PAYMENT_METHODS.value
          .replace(/['"]+/g, "") // Remove any existing quotes
          .split(",")
          .map((method: string) => method.trim().replace(/\s+/g, ""))
          .filter(Boolean); // Remove empty entries

        // Create the request body
        const chipRequestBody = {
          brand_id: CHIP_BRAND_ID.value,
          reference: `BOOKING-${bookingId}`,
          platform: "web",
          purchase: {
            products: [
              {
                name: `Booking Session${
                  body.payment_type === 2 ? " (Deposit)" : ""
                }`,
                price: Math.round(body.payment_amount * 100),
              },
            ],
            currency: "MYR",
          },
          client: {
            full_name: body.name,
            email: body.email,
          },
          success_callback: `${process.env.PUBLIC_API_URL}/booking/payment-callback`,
          success_redirect: `${process.env.PUBLIC_URL}/book-a-session/receipt?booking=${receiptNumber}&status=success`,
          failure_redirect: `${process.env.PUBLIC_URL}/book-a-session/failed-payment?booking=${receiptNumber}&status=failed`,
          cancel_redirect: `${process.env.PUBLIC_URL}/book-a-session/failed-payment?booking=${receiptNumber}&status=cancelled`,
          send_receipt: true,
          skip_capture: false,
        };

        // Create request body string with explicit double quotes for payment methods
        // const requestBody = `${JSON.stringify(chipRequestBody).slice(0, -1)},"payment_method_whitelist":["${methods.join('","')}"]}`

        console.log("CHIP Request Body:", JSON.stringify(chipRequestBody));

        try {
          // Use retry mechanism with the fetch request
          const makeRequest = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
            
            try {
              const response = await fetch(
                "https://gate.chip-in.asia/api/v1/purchases/",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${CHIP_SECRET_KEY.value}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(chipRequestBody),
                  signal: controller.signal
                }
              );
              
              clearTimeout(timeoutId);
              return response;
            } catch (err) {
              clearTimeout(timeoutId);
              throw err;
            }
          };
          
          // Attempt the fetch with retries
          const chipResponse = await retry(makeRequest, 3, 2000);
          
          console.log("CHIP Response:", chipResponse);
          console.log("CHIP Response Status:", chipResponse.status);
          console.log("CHIP Response Status Text:", chipResponse.statusText);

          const chipData = await chipResponse.json();
          // console.log("CHIP Data:", chipData);

          if (chipResponse.status !== 201) {
            // If CHIP payment initialization fails, update booking status to failed
            await knex("booking").where("id", bookingId).update({ status: 4 }); // 4 = Failed

            throw createError({
              statusCode: chipResponse.status,
              statusMessage: chipData.message || "Failed to initialize payment",
            });
          }

          // Update booking with CHIP purchase ID
            // await knex("booking")
            //   .where("id", bookingId)
            //   .update({ chip_purchase_id: chipData.id });

            return {
              status: "success",
              message: "Booking created and payment initialized successfully",
              data: {
                booking_id: bookingId,
                receipt_number: receiptNumber,
                checkout_url: chipData.checkout_url,
                purchase_id: chipData.id,
              },
            };
          } catch (fetchError: any) {
            console.error("CHIP payment fetch error:", fetchError);
            
            // Check if we should fallback to manual payment
            // const allowFallbackToManual = await knex("config")
            //   .select("value")
            //   .where("code", "allow_payment_gateway_fallback")
            //   .first()
            //   .then(result => result && result.value === "1")
            //   .catch(() => false);
              
            // if (allowFallbackToManual) {
            //   console.log("Falling back to manual payment method due to payment gateway issues");
              
            //   // Update booking to use manual payment method
            //   await knex("booking")
            //     .where("id", bookingId)
            //     .update({ 
            //       payment_method: 2, // Manual payment
            //       status: 1 // Pending
            //     });
                
            //   // Get admin phone number for notification
            //   const adminPhoneNumber = await knex("config")
            //     .select("value")
            //     .where("code", "admin_phoneno")
            //     .first();

            //   // Send WhatsApp notification to admin
            //   await sendWhatsAppNotification(
            //     adminPhoneNumber.value,
            //     receiptNumber,
            //     "admin"
            //   );

            //   // Send WhatsApp notification to customer
            //   await sendWhatsAppNotification(body.phone, receiptNumber, "customer");

            //   return {
            //     status: "success",
            //     message: "Booking created with manual payment due to payment gateway issues",
            //     data: `/book-a-session/receipt-qr?booking=${receiptNumber}&status=success&fallback=true`,
            //   };
            // }
            
            // If fallback is not allowed, proceed with regular error handling
            await knex("booking").where("id", bookingId).update({ status: 4 });
            throw createError({
              statusCode: fetchError.statusCode || 500,
              statusMessage: "Failed to process CHIP payment: " + (fetchError.message || "Connection timeout"),
            });
          }
        } catch (error: any) {
          console.error("CHIP payment outer error:", error);
          // Update booking status to failed
          await knex("booking").where("id", bookingId).update({ status: 4 });
          throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || "Internal server error",
          });
        }
      } else {
        // Manual Payment

        const adminPhoneNumber = await knex("config")
          .select("value")
          .where("code", "admin_phoneno")
          .first();

        // Send WhatsApp notification to admin
        await sendWhatsAppNotification(
          adminPhoneNumber.value,
          receiptNumber,
          "admin"
        );

        // Send WhatsApp notification to customer
        await sendWhatsAppNotification(body.phone, receiptNumber, "customer");

        return {
          status: "success",
          message: "Booking created successfully",
          // data: `${process.env.PUBLIC_URL}/book-a-session/receipt-qr?booking=${receiptNumber}&status=success`,
          data: `/book-a-session/receipt-qr?booking=${receiptNumber}&status=success`,
        };
      }
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || "Internal server error",
      });
    }
  });

// Add these utility functions at the top with other functions
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatWhatsAppMessage(text: string): string {
  return text.replace(/([.!?,])\s+/g, `$1\u200B `);
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
        `*New Manual Payment Booking Alert*\n\n` +
        `Reference: *${ref}*\n` +
        `Customer: *${booking.user_fullname}*\n` +
        `Phone: *${booking.user_phoneno}*\n` +
        `Email: *${booking.user_email}*\n` +
        `Session Date: *${formattedDate}*\n` +
        `Session Time: *${formattedTime}*\n` +
        `Amount to Pay: *RM ${formattedAmount}*\n\n` +
        `${
          booking.referral_code
            ? `Referral: *${booking.referral_code}*\n\n`
            : ""
        }` +
        `*Action Required:*\n` +
        `Please reconfirm the payment details with the customer once the payment is made.\n\n` +
        `_Please handle this request promptly._`;
    } else {
      message =
        `*Pengesahan Tempahan*\n` +
        `_${studioName.value}_\n\n` +
        `Salam dan hi, ${booking.user_fullname}\n\n` +
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
        `Sila lengkapkan pembayaran untuk mengesahkan tempahan anda & *hantarkan resit ke ${phone}.*\n\n` +
        `*Lokasi:*\n` +
        `${wazeUrl ? `🚗 Waze: ${wazeUrl.value}` : ""}\n` +
        `${googleMapsUrl ? `📍 Google Maps: ${googleMapsUrl.value}` : ""}\n\n` +
        `Jika anda mempunyai sebarang pertanyaan, sila hubungi kami di ${phone}\n\n` +
        `_Ini adalah notifikasi automatik. Jangan balas mesej ini._`;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeStr: string): string {
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-MY", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatNumber(number: number): string {
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatMalayDate(date: string) {
  const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const d = dayjs(date);
  return `${days[d.day()]}, ${d.format("DD MMMM YYYY")}`;
}
