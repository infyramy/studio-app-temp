import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get lp-title content
    const lpTitle = await db("config")
      .where("code", "lp_title_content")
      .select("value")
      .first();

    // Get lp-description content
    // Get lp-description content
    const lpDescription = await db("config")
      .where("code", "lp_desc_content")
      .select("value")
      .first();

    // Get lp-button-text content
    const lpButtonText = await db("config")
      .where("code", "lp_btn_text")
      .select("value")
      .first();

    // Get lp-button-redirect content
    const lpButtonRedirect = await db("config")
      .where("code", "lp_btn_redirect")
      .select("value")
      .first();

    // Get company name
    const companyName = await db("config")
      .where("code", "company_name")
      .select("value")
      .first();

    // Get ssm number
    const ssmNumber = await db("config")
      .where("code", "ssm_number")
      .select("value")
      .first();

    // Get company address
    const companyAddress = await db("config")
      .where("code", "company_address")
      .select("value")
      .first();

    // Get admin phone number
    const adminPhoneNumber = await db("config")
      .where("code", "admin_phoneno")
      .select("value")
      .first();

    // Get lp-img-1
    const lpImg1 = await db("config")
      .where("code", "lp_img_1")
      .select("value")
      .first();

    // Get lp-img-2
    const lpImg2 = await db("config")
      .where("code", "lp_img_2")
      .select("value")
      .first();

    // Get lp-img-3
    const lpImg3 = await db("config")
      .where("code", "lp_img_3")
      .select("value")
      .first();

    return {
      statusCode: 200,
      status: "success",
      data: {
        title: lpTitle.value,
        description: lpDescription.value,
        buttonText: lpButtonText.value,
        redirectUrl: lpButtonRedirect.value,
        companyName: companyName.value,
        ssmNumber: ssmNumber.value,
        companyAddress: companyAddress.value,
        adminPhoneNumber: adminPhoneNumber.value,
        lpImg1: lpImg1.value,
        lpImg2: lpImg2.value,
        lpImg3: lpImg3.value,
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
