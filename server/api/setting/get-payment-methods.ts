import knex from "../../utils/knex";

interface ChipResponse {
  names: Record<string, string>;
}

export default defineEventHandler(async (event) => {
  try {
    // Get chip brand id
    const chipBrandId = await knex("config")
      .select("value")
      .where("code", "chip_brand_id")
      .first();

    // Get chip secret key
    const chipSecretKey = await knex("config")
      .select("value")
      .where("code", "chip_key")
      .first();

    const chipResponse = await $fetch<ChipResponse>(
      `https://gate.chip-in.asia/api/v1/payment_methods/?brand_id=${chipBrandId.value}&currency=MYR`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${chipSecretKey.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("CHIP Response:", chipResponse.names);

    const result = Object.entries(chipResponse.names).map(([method, title]) => ({
      method,
      title,
    }));

    return {
      statusCode: 200,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch payment methods",
    });
  }
});
