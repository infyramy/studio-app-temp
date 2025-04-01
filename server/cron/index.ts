import cron from "node-cron";
import { checkPaymentStatus } from "./payment-status";
import { sendBookingReminders } from "./booking-reminder";

export function initializeCronJobs() {
  // Check payment status every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      await checkPaymentStatus();
    } catch (error) {
      console.error('Error in payment status cron job:', error);
    }
  });

  // Send booking reminders at 7 AM, 7 PM, and 11:30 PM daily
  cron.schedule("30 23,7,19 * * *", async () => {
    try {
      await sendBookingReminders();
    } catch (error) {
      console.error("Error in booking reminder cron job:", error);
    }
  });
} 