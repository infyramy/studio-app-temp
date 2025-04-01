import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get slot config
    const slotConfig = await db("slot_config")
      .where("title", "Main Slot")
      .select("start_time", "end_time", "duration", "rest", "start_date", "end_date")
      .first();

    const breaks = await db("break_time");

    const chargePerPax = await db("config")
      .where("code", "charge_per_pax")
      .select("value")
      .first();

    const maxFreePax = await db("config")
      .where("code", "max_free_pax")
      .select("value")
      .first();

    const maxPax = await db("config")
      .where("code", "max_pax")
      .select("value")
      .first();

    return {
      statusCode: 200,
      status: "success",
      data: {
        slotConfig,
        breaks,
        chargePerPax: chargePerPax.value,
        maxFreePax: maxFreePax.value,
        maxPax: maxPax.value,
      },
    };
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch configurations",
    });
  }
});
