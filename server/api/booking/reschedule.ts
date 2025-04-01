import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const { bookingId, session_date, session_time } = await readBody(event);

    console.log(bookingId, session_date, session_time);

    await db("booking").where("id", bookingId).update({
      session_date: session_date,
      session_time: session_time,
    });

    return {
      statusCode: 200,
      success: true,
      message: "Session rescheduled successfully",
    };
  } catch (error) {
    console.error("Error rescheduling session:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to reschedule session",
    });
  }
});
