import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const themes = await db("theme").where("status", 1);

    let result = [];

    for (const theme of themes) {
      // Get all pax prices
      const paxPrices = await db("theme_pax_prices").where("theme", theme.id);
      theme.pax_prices = paxPrices;

      // Get all date specific prices
      const dateSpecificPrices = await db("theme_date_specific_prices").where(
        "theme",
        theme.id
      );
      theme.date_specific_prices = dateSpecificPrices;

      result.push({
        id: theme.id,
        title: theme.title,
        description: theme.description,
        price_type: theme.price_type,
        price: theme.price,
        deposit: theme.deposit,
        is_active: theme.status,
        specific_date: theme.specific_date,
        image: theme.image,
        pax_prices: paxPrices,
        date_specific_prices: dateSpecificPrices,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching themes:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch themes",
    });
  }
});
