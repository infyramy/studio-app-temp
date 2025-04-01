import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const dateRange = await db("slot_config")
      .select("start_date", "end_date")
      .first();

    return {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    };
  } catch (error) {
    console.error("Error fetching config:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch config",
    });
  }
});
