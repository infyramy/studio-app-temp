import { defineEventHandler, readBody, createError } from "h3";
import db from "~/server/utils/knex";
import { DateSpecificPrice } from "~/types/dashboard";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const themeId = id;
    if (!themeId) {
      throw createError({
        statusCode: 400,
        message: "Theme ID is required",
      });
    }

    const body = await readBody(event);
    const { date_prices } = body;

    if (date_prices.length > 0) {
      // Get existing date-specific prices for the theme
      const existingDatePrices = await db("theme_date_specific_prices").where({
        theme: themeId,
      });
      const existingDatePriceIds = existingDatePrices.map(
        (price: DateSpecificPrice) => price.id
      );

      // Separate date prices into new and existing ones
      const datePricesToUpdate = date_prices.filter(
        (price: DateSpecificPrice) => price.id
      );
      const datePricesToAdd = date_prices.filter(
        (price: DateSpecificPrice) => !price.id
      );

      // Get IDs that should be deleted (exist in DB but not in the new array)
      const datePriceIdsToDelete = existingDatePriceIds.filter(
        (id) =>
          !datePricesToUpdate.find(
            (price: DateSpecificPrice) => price.id === id
          )
      );

      // Delete removed date prices
      if (datePriceIdsToDelete.length > 0) {
        await db("theme_date_specific_prices")
          .whereIn("id", datePriceIdsToDelete as number[])
          .delete();
      }

      // Update existing date prices
      for (const price of datePricesToUpdate) {
        await db("theme_date_specific_prices").where({ id: price.id }).update({
          start_date: price.start_date,
          end_date: price.end_date,
          amount: price.amount,
          price_type: price.price_type,
        });
      }

      // Add new date prices
      if (datePricesToAdd.length > 0) {
        await db("theme_date_specific_prices").insert(
          datePricesToAdd.map((price: DateSpecificPrice) => ({
            theme: themeId,
            start_date: price.start_date,
            end_date: price.end_date,
            amount: price.amount,
            price_type: price.price_type,
          }))
        );
      }
    } else {
      // Delete all date-specific prices for the theme
      await db("theme_date_specific_prices").where({ theme: themeId }).delete();
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Date-specific prices updated successfully",
    };
  } catch (error) {
    console.error("Error updating date-specific prices:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update date-specific prices",
    });
  }
});
