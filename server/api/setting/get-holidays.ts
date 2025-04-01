import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const holidays = await db("holidays");

    return {
      statusCode: 200,
      data: holidays,
    };
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch holidays",
    };
  }
});
