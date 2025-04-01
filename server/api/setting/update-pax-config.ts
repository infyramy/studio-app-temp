import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { maxPax, maxFreePax, chargePerPax } = body;

    await db("config").where("code", "max_pax").update({
      value: maxPax,
    });

    await db("config").where("code", "max_free_pax").update({
      value: maxFreePax,
    });

    await db("config").where("code", "charge_per_pax").update({
      value: chargePerPax,
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Participant settings updated successfully",
    };
  } catch (error) {
    console.error("Error updating participant settings:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update participant settings",
    });
  }
});
