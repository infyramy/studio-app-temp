import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get bookings grouped by email with statistics
    const bookingsByEmail = await db("booking")
      .select([
        "user_email as email",
        "user_fullname as name",
        "user_phoneno as phone",
        db.raw("COUNT(*) as total_bookings"),
        db.raw("GROUP_CONCAT(DISTINCT theme.title) as themes"),
        db.raw("SUM(CASE WHEN session_status = 2 THEN 1 ELSE 0 END) as completed_session"),
        db.raw("SUM(CASE WHEN session_status = 1 THEN 1 ELSE 0 END) as pending_session"),
        db.raw("SUM(CASE WHEN session_status = 3 THEN 1 ELSE 0 END) as cancelled_session"),
        db.raw("MAX(booking.created_date) as latest_booking"),
        db.raw("MIN(booking.created_date) as first_booking")
      ])
      .leftJoin("theme", "booking.theme", "theme.id")
      .groupBy("user_email", "user_fullname", "user_phoneno")
      .orderBy("latest_booking", "desc");

    return bookingsByEmail;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch contacts"
    });
  }
});
