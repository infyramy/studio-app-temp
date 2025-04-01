export default defineEventHandler(async (event) => {
  try {
    const { wahaEndpoint, adminPhoneNumber } = await readBody(event);

    // Validate required fields
    if (!wahaEndpoint || !adminPhoneNumber) {
      return {
        statusCode: 400,
        message: "WAHA endpoint and admin phone number are required",
      };
    }

    // Validate URL format
    try {
      new URL(wahaEndpoint);
    } catch {
      return {
        statusCode: 400,
        message: "Invalid WAHA endpoint URL",
      };
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\d{1,14}$/;
    if (!phoneRegex.test(adminPhoneNumber)) {
      return {
        statusCode: 400,
        message: "Invalid phone number format. Must include country code (e.g., 60123456789)",
      };
    }

    // Update or create WhatsApp config
    await knex("config").where("code", "waha_endpoint").update({
      value: wahaEndpoint,
    });

    await knex("config").where("code", "admin_phoneno").update({
      value: adminPhoneNumber,
    });

    return {
      statusCode: 200,
      message: "WhatsApp configuration updated successfully",
    };
  } catch (error) {
    console.error("Failed to update WhatsApp config:", error);
    return {
      statusCode: 500,
      message: "Failed to update WhatsApp configuration",
    };
  }
});
