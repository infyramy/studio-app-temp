import db from "../utils/knex";
import { addDays, startOfDay, endOfDay } from "date-fns";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { logger } from "../utils/logger";
import { BookingReminder, ConfigValues, ConfigRow } from "../types/booking";
import { z } from "zod"; // For runtime validation

// Configure dayjs to handle timezones
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Kuala_Lumpur");

// Constants
const BATCH_SIZE = 10;
const MAX_RETRIES = 3;
const BASE_DELAY = 500;
const MAX_TYPING_DURATION = 5000;
const MALAYSIA_TIMEZONE = "Asia/Kuala_Lumpur";

// Validation schema for phone numbers
const phoneNumberSchema = z.string().regex(/^\d{10,15}$/);

export async function sendBookingReminders(): Promise<void> {
  const functionLogger = logger.child({ function: 'sendBookingReminders' });
  
  try {
    await db.transaction(async (trx) => {
      // Get tomorrow's date in Malaysia timezone
      const now = dayjs().tz(MALAYSIA_TIMEZONE);
      const tomorrow = now.add(1, 'day');
      const tomorrowStart = tomorrow.startOf('day').toDate();
      const tomorrowEnd = tomorrow.endOf('day').toDate();

      functionLogger.info({ 
        tomorrowStart: tomorrowStart.toISOString(), 
        tomorrowEnd: tomorrowEnd.toISOString(),
        timezone: MALAYSIA_TIMEZONE 
      }, 'Processing bookings for tomorrow');

      // Get all config values in a single query
      const config = await getConfigDetailsOptimized(trx);

      // Find all confirmed bookings for tomorrow that haven't been reminded
      const tomorrowBookings = await getTomorrowBookings(trx, tomorrowStart, tomorrowEnd);
      
      functionLogger.info({ 
        bookingCount: tomorrowBookings.length,
        date: tomorrow.format('YYYY-MM-DD'),
        timezone: MALAYSIA_TIMEZONE
      }, 'Found bookings to process');

      // Process in smaller batches
      for (let i = 0; i < tomorrowBookings.length; i += BATCH_SIZE) {
        const batch = tomorrowBookings.slice(i, i + BATCH_SIZE);
        await processBatch(batch, config, trx);
        
        // Respect rate limits
        await delay(1000);
      }
    });

    functionLogger.info('Booking reminders completed successfully');
  } catch (error) {
    functionLogger.error({ error }, 'Fatal error in reminder processing');
    throw error;
  }
}

async function getConfigDetailsOptimized(trx: any): Promise<ConfigValues> {
  const configRows = await trx('config')
    .select(['code', 'value'])
    .whereIn('code', [
      'company_name',
      'admin_phoneno',
      'waha_endpoint',
      'waze_url',
      'google_maps_url'
    ]) as ConfigRow[];

  const config = Object.fromEntries(
    configRows.map((row: ConfigRow) => [row.code, row.value])
  ) as unknown as ConfigValues;

  // Validate required config values
  if (!config.waha_endpoint || !config.company_name) {
    throw new Error('Missing required configuration values');
  }

  return config;
}

async function getTomorrowBookings(trx: any, start: Date, end: Date): Promise<BookingReminder[]> {
  return trx("booking")
    .select(
      "booking.*",
      "theme.title as theme_title",
      "referral.referral as referral_code"
    )
    .leftJoin("theme", "booking.theme", "theme.id")
    .leftJoin("referral", "booking.referral", "referral.id")
    .where("session_date", ">=", start)
    .where("session_date", "<=", end)
    .where("session_status", 1)
    .where("reminder", 0) // Only get unsent reminders
    .whereIn("booking.status", [2, 3]);
}

async function processBatch(
  bookings: BookingReminder[],
  config: ConfigValues,
  trx: any
): Promise<void> {
  await Promise.all(
    bookings.map(async (booking) => {
      const bookingLogger = logger.child({ 
        bookingRef: booking.payment_ref_number,
        phoneNumber: booking.phone_number 
      });

      try {
        // Validate phone number
        if (!phoneNumberSchema.safeParse(booking.phone_number).success) {
          throw new Error('Invalid phone number format');
        }

        await sendReminderWithRetry(booking, config, bookingLogger);
        await updateReminderStatus(booking.payment_ref_number, trx);
        
        bookingLogger.info('Reminder sent successfully');
      } catch (error) {
        bookingLogger.error({ error }, 'Failed to send reminder');
        // Continue processing other bookings
      }
    })
  );
}

async function sendReminderWithRetry(
  booking: BookingReminder,
  config: ConfigValues,
  bookingLogger: any,
  retryCount = 0
): Promise<void> {
  try {
    const chatId = `${booking.phone_number}@c.us`;
    const message = generateReminderMessage(booking, config);

    // Mark chat as seen
    await makeWahaRequest(`${config.waha_endpoint}/api/sendSeen`, { chatId });
    await delay(1000);

    // Simulate typing
    await simulateTyping(config.waha_endpoint, chatId, message);

    // Send message
    await makeWahaRequest(`${config.waha_endpoint}/api/sendText`, {
      chatId: `${booking.user_phoneno}@c.us`,
      text: message,
      session: "default",
      reply_to: "",
    });

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      bookingLogger.warn({ retryCount }, 'Retrying reminder send');
      await delay(Math.pow(2, retryCount) * 1000); // Exponential backoff
      return sendReminderWithRetry(booking, config, bookingLogger, retryCount + 1);
    }
    throw error;
  }
}

async function makeWahaRequest(url: string, body: any): Promise<any> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`WhatsApp API error: ${response.status}`);
  }

  return response.json();
}

function generateReminderMessage(booking: BookingReminder, config: ConfigValues): string {
  const formattedDate = formatMalayDate(booking.session_date);
  const formattedTime = formatTime(booking.session_time);
  const formattedAmount = formatNumber(booking.payment_total - booking.payment_amount);

  const message = [
    `*_${config.company_name}_*\n`,
    `Salam dan hi, ${booking.user_fullname}\n`,
    `Ini adalah peringatan bahawa sesi anda akan datang. Sila semak butiran tempahan di bawah.\n`,
    `*Butiran Tempahan Anda:*`,
    `No.​ Rujukan: *${booking.payment_ref_number}*`,
    `Tema: *${booking.theme_title}*`,
    `Pax: *${booking.number_of_pax} orang*`,
    `Tarikh Sesi: *${formattedDate}*`,
    `Masa Sesi: *${formattedTime}*\n`,
    `Jumlah Bayaran: *RM ${formattedAmount}*`,
    booking.referral_code ? `Referral: *${booking.referral_code}*\n` : '',
    `*Lokasi:*`,
    config.waze_url ? `🚗 Waze: ${config.waze_url}` : '',
    config.google_maps_url ? `📍 Google Maps: ${config.google_maps_url}\n` : '',
    `Jika anda mempunyai sebarang pertanyaan, sila hubungi kami di ${config.admin_phoneno}\n`,
    `_Ini adalah notifikasi automatik. Jangan balas mesej ini._`
  ].filter(Boolean).join('\n');

  return formatWhatsAppMessage(message);
}

async function updateReminderStatus(paymentRefNumber: string, trx: any): Promise<void> {
  await trx("booking")
    .where("payment_ref_number", paymentRefNumber)
    .update({ reminder: 1 });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMalayDate(date: string) {
  const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const d = dayjs(date).tz(MALAYSIA_TIMEZONE);
  return `${days[d.day()]}, ${d.format("DD MMMM YYYY")}`;
}

function formatTime(timeStr: string): string {
  // Ensure time is interpreted in Malaysia timezone
  const [hours, minutes] = timeStr.split(':');
  return dayjs()
    .tz(MALAYSIA_TIMEZONE)
    .hour(parseInt(hours))
    .minute(parseInt(minutes))
    .format('h:mm A');
}

function formatNumber(amount: number) {
  return amount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMalaysianDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const weekday = date.toLocaleDateString("en-MY", { weekday: "long" });
  return `${day}/${month}/${year} (${weekday})`;
}

function formatMalaysianDateBM(dateStr: string): string {
  const date = new Date(dateStr);
  const weekdayBM = {
    Sunday: "Ahad",
    Monday: "Isnin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Khamis",
    Friday: "Jumaat",
    Saturday: "Sabtu",
  }[date.toLocaleDateString("en-US", { weekday: "long" })];

  const monthBM = {
    January: "Januari",
    February: "Februari",
    March: "Mac",
    April: "April",
    May: "Mei",
    June: "Jun",
    July: "Julai",
    August: "Ogos",
    September: "September",
    October: "Oktober",
    November: "November",
    December: "Disember",
  }[date.toLocaleDateString("en-US", { month: "long" })];

  return `${weekdayBM}, ${date.getDate()} ${monthBM} ${date.getFullYear()}`;
}

// Add delay utility function
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add message formatting helper
function formatWhatsAppMessage(text: string): string {
  // Add zero-width space after certain punctuation to prevent WhatsApp from detecting spam
  return text.replace(/([.!?,])\s+/g, `$1\u200B `);
}

// Add typing simulation based on message length
async function simulateTyping(
  wahaEndpoint: string,
  chatId: string,
  message: string
): Promise<void> {
  try {
    await makeWahaRequest(`${wahaEndpoint}/api/startTyping`, { chatId });

    const typingDuration = Math.min(
      BASE_DELAY + message.length * (Math.floor(Math.random() * 100) + 100),
      MAX_TYPING_DURATION
    );

    await delay(typingDuration);
    await makeWahaRequest(`${wahaEndpoint}/api/stopTyping`, { chatId });
  } catch (error) {
    logger.error({ error }, 'Error simulating typing');
    // Don't throw - typing simulation is non-critical
  }
}
