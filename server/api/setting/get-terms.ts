import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const terms = await db("config").where("code", "tnc").first();

    if (!terms) {
      return {
        statusCode: 404,
        message: "Terms and conditions not found",
      };
    }

    return {
      statusCode: 200,
      data: terms.value || "",
    };
  } catch (error) {
    console.error("Error fetching terms and conditions:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
