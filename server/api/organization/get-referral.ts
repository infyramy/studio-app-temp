import db from "../../utils/knex";
import status from "../auth/google/status";

export default defineEventHandler(async (event) => {
  try {
    // Get referral

    const referral = await db("referral");

    let result = []

    for (const ref of referral) {

      const bookings = await db("booking").select("payment_ref_number as id", "user_fullname as customerName", "created_date as date", "session_status as status").where("referral", ref.id);


      result.push({
        id: ref.id,
        code: ref.referral,
        memberName: ref.member,
        totalBookings: bookings.length,
        status: ref.status,
        bookings: bookings,
      });
    }

    return {
      statusCode: 200,
      status: "success",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch configurations",
    });
  }
});
