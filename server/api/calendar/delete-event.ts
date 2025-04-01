import knex from "../../utils/knex";
import { createCalendarEvent } from "../../utils/calendar";

export default defineEventHandler(async (event) => {
  try {
    const { bookingId } = await readBody(event);
    console.log("bookingId", bookingId);

    // Get the booking
    const booking = await knex("booking")
      .select("booking.id as booking_id", "booking.calendar_event_id")
      .where("booking.id", bookingId)
      .first();

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: "Booking not found",
      });
    }

    const calendarEvent = await deleteCalendarEvent(booking);

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
