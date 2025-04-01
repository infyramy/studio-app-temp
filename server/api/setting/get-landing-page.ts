import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get all config values in a single query
    const configs = await db("config")
      .whereIn("code", [
        "lp_title_content",
        "lp_desc_content",
        "lp_btn_text",
        "lp_btn_redirect",
        "company_name",
        "ssm_number",
        "company_address",
        "admin_phoneno",
        "lp_img_1",
        "lp_img_2",
        "lp_img_3"
      ])
      .select("code", "value");

    // Convert array to object for easier access
    const config = Object.fromEntries(
      configs.map(row => [row.code, row.value])
    );

    return {
      statusCode: 200,
      status: "success",
      data: {
        title: config.lp_title_content,
        description: config.lp_desc_content,
        buttonText: config.lp_btn_text,
        redirectUrl: config.lp_btn_redirect,
        companyName: config.company_name,
        ssmNumber: config.ssm_number,
        companyAddress: config.company_address,
        adminPhoneNumber: config.admin_phoneno,
        lpImg1: config.lp_img_1,
        lpImg2: config.lp_img_2,
        lpImg3: config.lp_img_3
      }
    };
  } catch (error) {
    console.error("Error fetching landing page config:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch landing page configuration"
    });
  }
});
