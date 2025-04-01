import db from "../../utils/knex";
import { deleteCalendarEvent } from "../../utils/calendar";

export default defineEventHandler(async (event) => {
  try {
    const { bookingId, status } = await readBody(event);

    console.log(bookingId, status);

    const booking = await db("booking")
      .select("id as booking_id", "session_status", "calendar_event_id")
      .where("id", bookingId)
      .first();

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: "Booking not found",
      });
    }

    await db("booking")
      .where("id", bookingId)
      .update({ session_status: status });

    // Check if current status is 1 or 2 and new status is 3 and calendar_event_id is not null
    if (booking.session_status == 1 || booking.session_status == 2) {
      if (status == 3 && booking.calendar_event_id) {
        await deleteCalendarEvent(booking);
      }
    }

    return {
      statusCode: 200,
      success: true,
      message: "Session status updated successfully",
    };
  } catch (error) {
    console.error("Error updating session status:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update session status",
    });
  }
});
