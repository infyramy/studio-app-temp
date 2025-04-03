import db from "./knex";

interface BookingData {
  ref: string;
  user_fullname: string;
  user_email: string;
  user_phoneno: string;
  theme: string;
  session_date: string;
  session_time: string;
  number_of_pax: number;
  receipt_url?: string;
  referral_code?: string;
  payment_method?: number;
  payment_status?: string;
  payment_total?: number;
  payment_amount?: number;
  theme_title?: string;
}

interface RateLimit {
  lastMessageTime: number;
  messageCount: number;
  hourStart: number;
}

// Different rate limits for admin vs customer
const RATE_LIMITS = {
  admin: {
    messagesPerHour: 50,    // Higher limit for admin notifications
    minInterval: 1000,      // Shorter interval (1 second)
  },
  customer: {
    messagesPerHour: 4,     // Stricter limit for customers
    minInterval: 5000,      // Longer interval (5 seconds)
  }
};

// Essential timing for notifications
const NOTIFICATION_DELAYS = {
  initial: 1000,      // 1 second before starting
  typing: 2000,       // 2 seconds typing indicator
  between: 3000       // 3 seconds between messages if multiple
};

const rateLimits = new Map<string, RateLimit>();

function checkRateLimit(phoneNumber: string, type: "admin" | "customer"): boolean {
  const now = Date.now();
  const hour = Math.floor(now / (60 * 60 * 1000));
  
  let limit = rateLimits.get(phoneNumber);
  if (!limit) {
    limit = {
      lastMessageTime: now,
      messageCount: 0,
      hourStart: hour
    };
    rateLimits.set(phoneNumber, limit);
  }

  // Reset counter if new hour
  if (hour !== limit.hourStart) {
    limit.messageCount = 0;
    limit.hourStart = hour;
  }

  const limits = RATE_LIMITS[type];

  // Check minimum interval between messages
  if (now - limit.lastMessageTime < limits.minInterval) {
    return false;
  }

  // Check hourly limit
  if (limit.messageCount >= limits.messagesPerHour) {
    return false;
  }

  limit.messageCount++;
  limit.lastMessageTime = now;
  return true;
}

function formatWhatsAppMessage(message: string): string {
  // Add zero-width spaces after punctuation
  const punctuations = ['.', '!', '?', ':', ';', ','];
  let formatted = message;
  
  punctuations.forEach(punct => {
    const regex = new RegExp(`\\${punct}`, 'g');
    formatted = formatted.replace(regex, `${punct}\u200B`);
  });

  return formatted;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function formatMalaysianDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMalaysianDateBM(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendWhatsAppNotification(
  type: "admin" | "customer",
  phoneNumber: string,
  bookingData: BookingData,
  wahaEndpoint: string,
  wazeUrl: string,
  googleMapsUrl: string
) {
  console.log("Sending WhatsApp notification to:", phoneNumber);

  try {
    const chatId = `${phoneNumber}@c.us`;
    const formattedTime = formatTime(bookingData.session_time);

    // Get company name and admin phone number from config
    const [companyNameConfig, adminPhoneConfig] = await Promise.all([
      db("config").where("code", "company_name").first(),
      db("config").where("code", "admin_phoneno").first()
    ]);

    const companyName = companyNameConfig?.value || "Studio";
    const adminPhoneNumber = adminPhoneConfig?.value || "N/A";

    // Different handling for admin vs customer
    if (type === "admin") {
      // Admin notifications: Fast delivery
      await fetch(`${wahaEndpoint}/api/sendSeen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });

      // Short delay for admin
      await delay(500);

      // Check if it's a manual payment
      const isManualPayment = bookingData.payment_method === 2;
      const totalAmount = bookingData.payment_total || 0;
      const paidAmount = bookingData.payment_amount || 0;
      const balance = totalAmount - paidAmount;

      const message = isManualPayment 
        ? `*🔔 Manual Booking Alert!*\n\n` +
          `*Booking Reference*\n` +
          `• Reference No: *#${bookingData.ref}*\n` +
          `• Status: *${bookingData.payment_status || 'Pending'}*\n` +
          `• Payment Method: *Manual*\n\n` +
          `*Session Details*\n` +
          `• Theme: *${bookingData.theme_title}*\n` +
          `• Date: *${formatMalaysianDate(bookingData.session_date)}*\n` +
          `• Time: *${formattedTime}*\n` +
          `• No. of Pax: *${bookingData.number_of_pax}*\n` +
          `• Total Amount: *RM ${totalAmount}*\n` +
          `• Paid Amount: *RM ${paidAmount}*\n` +
          `• Balance: *RM ${balance}*\n\n` +
          `*Customer Information*\n` +
          `• Name: *${bookingData.user_fullname}*\n` +
          `• Phone: *${bookingData.user_phoneno}*\n` +
          `• Email: *${bookingData.user_email}*\n` +
          (bookingData.referral_code ? `• Referral Code: *${bookingData.referral_code}*\n` : "") +
          (bookingData.receipt_url ? `• Receipt: *${bookingData.receipt_url}*\n` : "") +
          `\n_Please check the payment and change the status manually in dashboard_`
        : `*🔔 New Confirmed Booking*\n\n` +
          `*Booking Reference*\n` +
          `• Reference No: *#${bookingData.ref}*\n` +
          `• Status: *${bookingData.payment_status || 'Pending'}*\n` +
          `• Payment Method: *Payment Gateway*\n\n` +
          `*Session Details*\n` +
          `• Theme: *${bookingData.theme_title}*\n` +
          `• Date: *${formatMalaysianDate(bookingData.session_date)}*\n` +
          `• Time: *${formattedTime}*\n` +
          `• No. of Pax: *${bookingData.number_of_pax}*\n` +
          `• Total Amount: *RM ${totalAmount}*\n` +
          `• Paid Amount: *RM ${paidAmount}*\n` +
          `• Balance: *RM ${balance}*\n\n` +
          `*Customer Information*\n` +
          `• Name: *${bookingData.user_fullname}*\n` +
          `• Phone: *${bookingData.user_phoneno}*\n` +
          `• Email: *${bookingData.user_email}*\n` +
          (bookingData.referral_code ? `• Referral Code: *${bookingData.referral_code}*\n` : "") +
          (bookingData.receipt_url ? `• Receipt: *${bookingData.receipt_url}*\n` : "");

      const formattedMessage = formatWhatsAppMessage(message);
      const response = await fetch(`${wahaEndpoint}/api/sendText`, {
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

      console.log(`Admin notification sent to ${phoneNumber}:`, response.status);
      return true;

    } else {
      // Customer notifications: More controlled delivery
      // Check rate limit only for customer messages
      if (!checkRateLimit(phoneNumber, "customer")) {
        console.log(`Rate limit reached for customer ${phoneNumber}`);
        return false;
      }

      await fetch(`${wahaEndpoint}/api/sendSeen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });

      // Longer delay for customer
      await delay(1000);

      // Start typing indicator for customer
      await fetch(`${wahaEndpoint}/api/startTyping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });

      await delay(2000);

      await fetch(`${wahaEndpoint}/api/stopTyping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });

      const message = `*${companyName}*\n` +
        `*Tempahan anda telah berjaya!*\n\n` +
        `*Butiran Tempahan Anda*\n` +
        `• Tema: *${bookingData.theme}*\n` +
        `• Tarikh: *${formatMalaysianDateBM(bookingData.session_date)}*\n` +
        `• Masa: *${formattedTime}*\n` +
        `• Jumlah Peserta: *${bookingData.number_of_pax} orang*\n` +
        `• Rujukan: *#${bookingData.ref}*` +
        (bookingData.referral_code ? `\n• Kod Rujukan: *${bookingData.referral_code}*` : "") +
        (bookingData.receipt_url ? `\n• Resit Tempahan: *${bookingData.receipt_url}*` : "") +
        
        `\n\n*Lokasi Studio*` +
        (wazeUrl ? `\n🚗 Waze: ${wazeUrl}` : "") +
        (googleMapsUrl ? `\n📍 Google Maps: ${googleMapsUrl}` : "") +
        
        `\n\nSekiranya anda mempunyai sebarang pertanyaan, sila hubungi kami di:\n` +
        `*${adminPhoneNumber}*\n\n` +
        `_Terima kasih dan jumpa anda nanti!_`;

      const formattedMessage = formatWhatsAppMessage(message);
      const response = await fetch(`${wahaEndpoint}/api/sendText`, {
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

      console.log(`Customer notification sent to ${phoneNumber}:`, response.status);
      return true;
    }
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return false;
  }
}