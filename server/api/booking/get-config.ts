import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const charge_per_pax = await db("config")
      .select("value")
      .where("code", "charge_per_pax")
      .first();

    const max_free_pax = await db("config")
      .select("value")
      .where("code", "max_free_pax")
      .first();

    const max_pax = await db("config")
      .select("value")
      .where("code", "max_pax")
      .first();

    const tnc = await db("config").select("value").where("code", "tnc").first();

    const logo = await db("config")
      .select("value")
      .where("code", "logo_url")
      .first();

    const lp_img_1 = await db("config")
      .select("value")
      .where("code", "lp_img_1")
      .first();

    const lp_img_2 = await db("config")
      .select("value")
      .where("code", "lp_img_2")
      .first();

    const lp_img_3 = await db("config")
      .select("value")
      .where("code", "lp_img_3")
      .first();

    const enable_chip = await db("config")
      .select("value")
      .where("code", "enable_chip")
      .first();

    const enable_manual = await db("config")
      .select("value")
      .where("code", "enable_manual")
      .first();

    const enable_full_payment = await db("config")
      .select("value")
      .where("code", "enable_full_payment")
      .first();

    const enable_deposit_payment = await db("config")
      .select("value")
      .where("code", "enable_deposit")
      .first();

    return {
      charge_per_pax: charge_per_pax.value,
      max_free_pax: max_free_pax.value,
      max_pax: max_pax.value,
      tnc: tnc.value,
      logo: logo.value,
      lp_img_1: lp_img_1.value,
      lp_img_2: lp_img_2.value,
      lp_img_3: lp_img_3.value,
      enable_chip: enable_chip.value,
      enable_manual: enable_manual.value,
      enable_full_payment: enable_full_payment.value,
      enable_deposit_payment: enable_deposit_payment.value,
    };
  } catch (error) {
    console.error("Error fetching config:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch config",
    });
  }
});
