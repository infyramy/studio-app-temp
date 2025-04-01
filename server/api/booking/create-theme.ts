import { defineEventHandler, readBody } from "h3";
import db from "~/server/utils/knex";
import { Theme, DateSpecificPrice } from "~/types/dashboard";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Theme data: ", body);

    // Insert theme
    const [themeId] = await db("theme").insert({
      title: body.title,
      description: body.description,
      price_type: body.price_type,
      price: body.price,
      deposit: body.deposit,
      status: 1,
      image: body.image,
    });

    if (body.price_type === 2) {
      for (const paxPrice of body.pax_prices) {
        await db("theme_pax_prices").insert({
          ...paxPrice,
          theme: themeId,
        });
      }
    }

    // Insert date-specific prices if any
    // if (date_specific_prices && date_specific_prices.length > 0) {
    //   const pricesData = date_specific_prices.map(
    //     (price: DateSpecificPrice) => ({
    //       ...price,
    //       theme_id: themeId,
    //     })
    //   );
    //   await db("theme_date_specific_prices").insert(pricesData);
    // }

    return {
      statusCode: 200,
      status: "success",
      message: "Theme created successfully",
    };
  } catch (error) {
    console.error("Error creating theme:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create theme",
    });
  }
});
