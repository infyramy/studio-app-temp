import db from "../utils/knex";
import { addMinutes, isBefore } from "date-fns";

export async function checkPaymentStatus(): Promise<void> {
  try {
    const tenMinutesAgo = addMinutes(new Date(), -10);

    console.log("Checking payment status...");

    // Find pending bookings older than 10 minutes without chip_purchase_id
    const expiredBookings = await db("booking")
      .where({
        status: 1, // pending status
      })
      .whereNull("chip_purchase_id")
      .where("created_date", "<=", tenMinutesAgo)
      .select("id");

    if (expiredBookings.length > 0) {
      // Update expired bookings to status 4
      await db("booking")
        .whereIn(
          "id",
          expiredBookings.map((booking) => booking.id)
        )
        .update({
          status: 4,
        });

      console.log(
        `Updated ${expiredBookings.length} expired bookings to status 4`
      );
    } else {
      // console.log("No expired bookings found");
    }

    console.log("Completed");
    
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
}
