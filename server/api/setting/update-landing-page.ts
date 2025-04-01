import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, description, buttonText, redirectUrl, image1, image2, image3 } = body;

    await db("config").where("code", "lp_title_content").update({
      value: title,
    });

    await db("config").where("code", "lp_desc_content").update({
      value: description,
    });

    await db("config").where("code", "lp_btn_text").update({
      value: buttonText,
    });

    await db("config").where("code", "lp_btn_redirect").update({
      value: redirectUrl,
    });

    await db("config").where("code", "lp_img_1").update({
      value: image1,
    });

    await db("config").where("code", "lp_img_2").update({
      value: image2,
    });

    await db("config").where("code", "lp_img_3").update({
      value: image3,
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Landing page settings updated successfully",
    };
  } catch (error) {
    console.error("Error updating participant settings:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update participant settings",
    });
  }
});
