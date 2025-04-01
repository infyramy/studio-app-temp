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
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Add message formatting helper
function formatWhatsAppMessage(text: string): string {
  // Add zero-width space after certain punctuation to prevent WhatsApp from detecting spam
  return text.replace(/([.!?,])\s+/g, `$1\u200B `);
}

// Add typing simulation based on message length
async function simulateTyping(wahaEndpoint: string, chatId: string, message: string) {
  try {
    // Start typing
    await fetch(`${wahaEndpoint}/api/startTyping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId }),
    });

    // Calculate typing duration based on message length (100-200ms per character)
    const baseDelay = 500; // minimum delay
    const charDelay = Math.floor(Math.random() * 100) + 100; // 100-200ms per char
    const typingDuration = Math.min(
      baseDelay + (message.length * charDelay),
      5000 // cap at 5 seconds
    );
    
    await delay(typingDuration);

    // Stop typing
    await fetch(`${wahaEndpoint}/api/stopTyping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId }),
    });
  } catch (error) {
    console.error('Error simulating typing:', error);
  }
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

    // Mark chat as seen first
    await fetch(`${wahaEndpoint}/api/sendSeen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId }),
    });

    // Initial delay before starting conversation
    await delay(1000);

    // Single message with minimal emojis
    let message = '';
    if (type === "admin") {
      message =
        `*New Booking Alert*\n\n` +
        `\n\n*Booking Details*\n` +
        `Reference: *#${bookingData.ref}*\n` +
        `Date: *${formatMalaysianDate(bookingData.session_date)}*\n` +
        `Time: *${formattedTime}*\n\n` +
        `*Session Info*\n` +
        `Theme: *${bookingData.theme}*\n` +
        `No. of Pax: *${bookingData.number_of_pax}*\n\n` +
        `*Client Details*\n` +
        `Name: *${bookingData.user_fullname}*\n` +
        `Email: *${bookingData.user_email}*\n` +
        `Phone: *${bookingData.user_phoneno}*` +
        (bookingData.referral_code ? `\nReferral: *${bookingData.referral_code}*` : "") +
        (bookingData.receipt_url ? `\nReceipt: *${bookingData.receipt_url}*` : "");
    } else {
      message =
        `*Pengesahan Tempahan*\n\n` +
        `Terima kasih kerana memilih perkhidmatan kami!\n\n` +
        `\n\n*Butiran Tempahan Anda*\n` +
        `Tema: *${bookingData.theme}*\n` +
        `Tarikh: *${formatMalaysianDateBM(bookingData.session_date)}*\n` +
        `Masa: *${formattedTime}*\n` +
        `Jumlah Peserta: *${bookingData.number_of_pax} orang*\n` +
        `Rujukan: *#${bookingData.ref}*` +
        (bookingData.referral_code ? `\nRujukan: *${bookingData.referral_code}*` : "") +
        (bookingData.receipt_url ? `\nLink resit: *${bookingData.receipt_url}*` : "") +
        
        `\n\n*Lokasi Studio*` +
        (wazeUrl ? `\n🚗 Waze: ${wazeUrl}` : "") +
        (googleMapsUrl ? `\n📍 Google Maps: ${googleMapsUrl}` : "") +
        
        `\n\nJika anda mempunyai sebarang pertanyaan, sila hubungi kami.\n\n` +
        `_Terima kasih kerana memilih perkhidmatan kami!_`;
    }

    const formattedMessage = formatWhatsAppMessage(message);
    
    // Simulate typing
    await simulateTyping(wahaEndpoint, chatId, formattedMessage);

    // Send the message
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

    console.log(`Message sent to ${phoneNumber}:`, response.status);
    console.log("Message sent successfully to:", phoneNumber);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return false;
  }
}
