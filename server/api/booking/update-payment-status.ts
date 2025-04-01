import db from "../../utils/knex";
import { deleteCalendarEvent, createCalendarEvent } from "../../utils/calendar";
export default defineEventHandler(async (event) => {
  try {
    const { bookingId, status } = await readBody(event);

    console.log(bookingId, status);

    // Get the booking
    const bookingDetail = await knex("booking")
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
        "referral.referral as referral",
        "booking.payment_amount as payment_amount",
        "booking.payment_deposit as payment_deposit",
        "booking.payment_total as payment_total",
        "booking.status as status",
        "booking.calendar_event_id as calendar_event_id"
      )
      .leftJoin("theme", "booking.theme", "theme.id")
      .leftJoin("referral", "booking.referral", "referral.id")
      .where("booking.id", bookingId)
      .first();

    if (!bookingDetail) {
      throw createError({
        statusCode: 404,
        statusMessage: "Booking not found",
      });
    }

    if (bookingDetail.status == 2 && status == 3) {
      await db("booking").where("id", bookingId).update({
        payment_amount: bookingDetail.payment_total,
        status: status,
      });
    } else if (bookingDetail.status == 3 && status == 2) {
      await db("booking").where("id", bookingId).update({
        payment_amount: bookingDetail.payment_deposit,
        status: status,
      });
    } else if (bookingDetail.status == 3 && status == 1) {
      await db("booking").where("id", bookingId).update({
        payment_amount: 0,
        status: status,
      });

      // Delete calendar event
      await deleteCalendarEvent(bookingDetail);
    } else if (bookingDetail.status == 3 && status == 4) {
      await db("booking").where("id", bookingId).update({
        payment_amount: 0,
        status: status,
      });

      // Delete calendar event
      await deleteCalendarEvent(bookingDetail);
    } else if (bookingDetail.status == 2 && status == 1) {
      await db("booking").where("id", bookingId).update({
        payment_amount: 0,
        status: status,
      });

      // Delete calendar event
      await deleteCalendarEvent(bookingDetail);
    } else if (bookingDetail.status == 2 && status == 4) {
      await db("booking").where("id", bookingId).update({
        payment_amount: 0,
        status: status,
      });

      // Delete calendar event
      await deleteCalendarEvent(bookingDetail);
    } else if (bookingDetail.status == 1 && status == 2) {
      await db("booking").where("id", bookingId).update({
        payment_amount: bookingDetail.payment_deposit,
        status: status,
      });

      // Create calendar event
      await createCalendarEvent(bookingDetail);
    } else if (bookingDetail.status == 1 && status == 3) {
      await db("booking").where("id", bookingId).update({
        payment_amount: bookingDetail.payment_total,
        status: status,
      });

      // Create calendar event
      await createCalendarEvent(bookingDetail);
    } else if (bookingDetail.status == 4 && status == 2) {
      await db("booking").where("id", bookingId).update({
        payment_amount: bookingDetail.payment_deposit,
        status: status,
      });

      // Create calendar event
      await createCalendarEvent(bookingDetail);
    } else if (bookingDetail.status == 4 && status == 3) {
      await db("booking").where("id", bookingId).update({
        payment_amount: bookingDetail.payment_total,
        status: status,
      });

      // Create calendar event
      await createCalendarEvent(bookingDetail);
    } else {
      await db("booking").where("id", bookingId).update({
        status: status,
      });
    }

    return {
      statusCode: 200,
      success: true,
      message: "Payment status updated successfully",
    };
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update payment status",
    });
  }
});
