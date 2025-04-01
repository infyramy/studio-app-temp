import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get from params
    const { receiptNumber } = getQuery(event);
    console.log("receiptNumber:", receiptNumber);

    // Check if receiptNumber is a valid booking number
    const booking = await knex("booking")
      .select(
        "booking.*",
        "theme.id as theme",
        "theme.title as title",
        "theme.price as theme_price",
        "referral.referral as referral_code",
      )
      .leftJoin("theme", "booking.theme", "theme.id")
      .leftJoin("referral", "booking.referral", "referral.id")
      .where("payment_ref_number", receiptNumber)
      .first();
    if (!booking) {
      throw createError({ statusCode: 404, message: "Booking not found" });
    }

    console.log("Booking:", booking);

    let result = null;
    let addons = [];

    // Ensure `booking.addon` is parsed
    const bookingAddons = JSON.parse(booking.addon || "[]");

    for (const addon of bookingAddons) {
      const addonDetail = await knex("addon").where("id", addon.id).first();
      addons.push({
        name: addonDetail.title,
        quantity: addon.qty,
        price: addonDetail.price,
      });
    }

    console.log("Addons:", addons);

    result = {
      ...booking,
      addons: addons,
    };

    return {
      statusCode: 200,
      status: "success",
      message: "Booking detail fetched successfully",
      data: result,
    };
  } catch (error) {
    console.log("Error fetching booking detail:", error);

    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
