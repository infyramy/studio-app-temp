import { H3Event } from "h3";
import knex from "../../utils/knex";

interface UpdateStatusRequest {
  receiptNumber: string;
  status: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { receiptNumber, status } = getQuery(event);
    
    console.log("Update status request:", { receiptNumber, status });

    if (!receiptNumber || !status) {
      console.log("Missing parameters:", { receiptNumber, status });
      throw createError({
        statusCode: 400,
        message: "Receipt number and status are required",
      });
    }

    // Get the booking
    console.log("Looking up booking with receipt number:", receiptNumber);
    const booking = await knex("booking")
      .where("payment_ref_number", receiptNumber)
      .first();

    if (!booking) {
      console.log("Booking not found for receipt number:", receiptNumber);
      throw createError({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    console.log("Booking found:", { 
      id: booking.id, 
      status: booking.status, 
      payment_type: booking.payment_type 
    });

    // Skip if booking is already successful (status 2 or 3)
    if (booking.status === 2 || booking.status === 3) {
      console.log("Booking already successful, skipping update");
      return {
        statusCode: 200,
        status: "success",
        message: "Booking already successful, skipping update",
      };
    }

    // Map status to booking status
    let paymentStatus;
    switch (status) {
      case "success":
        paymentStatus = booking.payment_type === 1 ? 3 : 2;
        break;
      case "failed":
        paymentStatus = 4;
        break;
      case "cancelled":
        paymentStatus = 4; // Cancelled
        break;
      default:
        paymentStatus = 1; // Pending
    }

    console.log("Mapped status:", { clientStatus: status, dbStatus: paymentStatus });

    // Update booking status
    console.log("Updating booking status to:", paymentStatus);
    await knex("booking").where("payment_ref_number", receiptNumber).update({
      payment_date: new Date(),
      status: paymentStatus,
      updated_date: new Date(),
    });

    // Log status transition
    console.log("Logging status transition in booking_status_log");
    await knex("booking_status_log").insert({
      booking_id: booking.id,
      old_status: booking.status,
      new_status: paymentStatus,
      payment_status: status,
      created_at: new Date(),
    });

    console.log("Status update completed successfully");
    return {
      statusCode: 200,
      status: "success",
      message: "Booking status updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update booking status",
    });
  }
});
