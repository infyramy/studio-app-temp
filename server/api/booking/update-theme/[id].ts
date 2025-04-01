import db from "../../../utils/knex";

interface PaxPrice {
  id?: number;
  theme?: string;
  min_pax: number;
  max_pax: number;
  price: number;
}

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    console.log("body:", body);

    // Validate required fields
    if (
      !body.title ||
      !body.description ||
      !body.price_type ||
      !body.price ||
      !body.deposit
    ) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    // Update theme
    await db("theme")
      .where({ id })
      .update({
        title: body.title,
        description: body.description,
        price_type: body.price_type,
        price: body.price,
        deposit: body.deposit,
        image: body.image || null,
      });

    // Process pax prices

    if (body.pax_prices.length > 0) {
      // Get existing pax prices for the theme
      const existingPaxPrices = await db("theme_pax_prices").where({
        theme: id,
      });
      const existingPaxPriceIds = existingPaxPrices.map(
        (price: PaxPrice) => price.id
      );

      // Separate pax prices into new and existing ones
      const paxPricesToUpdate = body.pax_prices.filter(
        (price: PaxPrice) => price.id
      );
      const paxPricesToAdd = body.pax_prices.filter(
        (price: PaxPrice) => !price.id
      );

      // Get IDs that should be deleted (exist in DB but not in the new array)
      const paxPriceIdsToDelete = existingPaxPriceIds.filter(
        (id) => !paxPricesToUpdate.find((price: PaxPrice) => price.id === id)
      );

      // Delete removed pax prices
      if (paxPriceIdsToDelete.length > 0) {
        await db("theme_pax_prices")
          .whereIn("id", paxPriceIdsToDelete as number[])
          .delete();
      }

      // Update existing pax prices
      for (const price of paxPricesToUpdate) {
        await db("theme_pax_prices").where({ id: price.id }).update({
          min_pax: price.min_pax,
          max_pax: price.max_pax,
          price: price.price,
        });
      }

      // Add new pax prices
      if (paxPricesToAdd.length > 0) {
        await db("theme_pax_prices").insert(
          paxPricesToAdd.map((price: PaxPrice) => ({
            theme: id,
            min_pax: price.min_pax,
            max_pax: price.max_pax,
            price: price.price,
          }))
        );
      }
    } else {
      // delete all pax prices for the theme
      await db("theme_pax_prices").where({ theme: id }).delete();
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Theme updated successfully",
    };
  } catch (error) {
    console.error("Error updating theme:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update theme",
    });
  }
});
