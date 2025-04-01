import { H3Event } from "h3";
import knex from "../../utils/knex";

interface UpdateStatusRequest {
  receiptNumber: string;
  status: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { receiptNumber, status } = getQuery(event);

    if (!receiptNumber || !status) {
      throw createError({
        statusCode: 400,
        message: "Receipt number and status are required",
      });
    }

    // Get the booking
    const booking = await knex("booking")
      .where("payment_ref_number", receiptNumber)
      .first();

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    // Skip if booking is already successful (status 2 or 3)
    if (booking.status === 2 || booking.status === 3) {
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

    // Update booking status
    await knex("booking").where("payment_ref_number", receiptNumber).update({
      payment_date: new Date(),
      status: paymentStatus,
      updated_date: new Date(),
    });

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
