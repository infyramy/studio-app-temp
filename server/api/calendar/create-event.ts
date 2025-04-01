import knex from "../../utils/knex";
import { createCalendarEvent } from "../../utils/calendar";

export default defineEventHandler(async (event) => {
  try {
    const { bookingId } = await readBody(event);
    console.log("bookingId", bookingId);

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

    const calendarEvent = await createCalendarEvent(booking);

    return {
      status: "success",
      message: "Calendar event created successfully",
      calendarEvent,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
