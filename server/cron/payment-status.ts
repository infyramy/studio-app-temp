import db from "../utils/knex";
import { addMinutes, isBefore } from "date-fns";

// Add a simple lock mechanism to prevent concurrent executions
let isCheckingPayments = false;

export async function checkPaymentStatus(): Promise<void> {
  // Prevent concurrent executions
  if (isCheckingPayments) {
    console.log("Payment status check already in progress, skipping");
    return;
  }
  
  isCheckingPayments = true;
  
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

    console.log("Payment status check completed");
    
  } catch (error) {
    console.error("Error checking payment status:", error);
  } finally {
    // Release lock whether successful or not
    isCheckingPayments = false;
  }
}
