export default defineEventHandler(async (event) => {
  try {
    const wahaEndpoint = await knex("config")
      .where("code", "waha_endpoint")
      .select("value")
      .first();

    const adminPhoneNumber = await knex("config")
      .where("code", "admin_phoneno")
      .select("value")
      .first();

    if (!wahaEndpoint || !adminPhoneNumber) {
      return {
        statusCode: 404,
        message: "WhatsApp configuration not found",
      };
    }

    return {
      statusCode: 200,
      data: {
        wahaEndpoint: wahaEndpoint?.value || "",
        adminPhoneNumber: adminPhoneNumber?.value || "",
      },
    };
  } catch (error) {
    console.error("Failed to fetch WhatsApp config:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch WhatsApp configuration",
    };
  }
});
