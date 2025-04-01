import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const addons = await db("addon").where("status", 1);
    return addons;
  } catch (error) {
    console.error("Error fetching addons:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch addons"
    });
  }
});
