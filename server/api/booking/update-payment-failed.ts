import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const { receiptNumber, status } = await getQuery(event);

    console.log(receiptNumber, status);

    // Get booking payment detail
    let bookingDetail = await db("booking")
      .where("payment_ref_number", receiptNumber)
      .first();

    if (!bookingDetail) {
      return {
        statusCode: 400,
        success: false,
        message: "Booking not found",
      };
    }

    // Check if booking already paid, skip update to failed
    if (bookingDetail.status == 2 || bookingDetail.status == 3) {
      return {
        statusCode: 400,
        success: false,
        message: "Booking already paid",
      };
    }

    // Update booking status to failed
    await db("booking")
      .where("payment_ref_number", receiptNumber)
      .update({
        status: status == "failed" || status == "cancelled" ? 4 : 5,
      });

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
