import db from "../../utils/knex";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    console.log("Body", body);

    const { bookingId } = body;

    // Get booking details
    const booking = await db("booking")
      .select(
        "booking.*",
        "theme.title as theme_title",
        "referral.referral as referral_code"
      )
      .leftJoin("theme", "booking.theme", "theme.id")
      .leftJoin("referral", "booking.referral", "referral.id")
      .where("booking.id", bookingId)
      .first();

    const formattedAmount = formatNumber(
      booking.payment_total - booking.payment_amount
    );

    const studioName = await db("config")
      .select("value")
      .where("code", "company_name")
      .first();

    const adminPhoneNo = await db("config")
      .select("value")
      .where("code", "admin_phoneno")
      .first();

    const wazeLocation = await db("config")
      .select("value")
      .where("code", "waze_url")
      .first();

    const googleMapsLocation = await db("config")
      .select("value")
      .where("code", "google_maps_url")
      .first();

    const formattedDate = formatMalayDate(booking.session_date);
    const formattedTime = formatTime(booking.session_time);

   const message =
      `*_${studioName.value}_*\n\n` +
      `Salam dan hi, ${booking.user_fullname}\n\n` +
      `Ini adalah peringatan bahawa sesi anda akan datang. Sila semak butiran tempahan di bawah.\n\n` +
      `*Butiran Tempahan Anda:*\n` +
      `No.​ Rujukan: *${booking.payment_ref_number}*\n` +
      `Tema: *${booking.theme_title}*\n` +
      `Pax: *${booking.number_of_pax} orang*\n` +
      `Tarikh Sesi: *${formattedDate}*\n` +
      `Masa Sesi: *${formattedTime}*\n\n` +
      `Jumlah Bayaran: *RM ${formattedAmount}*\n` +
      `${
        booking.referral_code ? `Referral: *${booking.referral_code}*\n\n` : ""
      }` +
      `*Lokasi:*\n` +
      `${wazeLocation ? `🚗 Waze: ${wazeLocation.value}` : ""}\n` +
      `${googleMapsLocation ? `📍 Google Maps: ${googleMapsLocation.value}` : ""}\n\n` +
      `Jika anda mempunyai sebarang pertanyaan, sila hubungi kami di ${adminPhoneNo.value}\n\n` +
      `_Ini adalah notifikasi automatik. Jangan balas mesej ini._`;

    const wahaEndpoint = await knex("config")
      .select("value")
      .where("code", "waha_endpoint")
      .first();

    const response = await fetch(`${wahaEndpoint.value}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        chatId: `${booking.user_phoneno}@c.us`,
        text: message,
        session: "default",
        reply_to: "",
      }),
    });

    console.log("Response", response);

    return {
      status: "success",
      message: "Reminder message sent successfully",
    };
  } catch (error) {
    console.error("Error generating reminder message:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to generate reminder message",
    });
  }
});

function formatNumber(amount: number) {
  return amount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTime(time: string) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatMalayDate(date: string) {
  const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const d = dayjs(date);
  return `${days[d.day()]}, ${d.format("DD MMMM YYYY")}`;
}
