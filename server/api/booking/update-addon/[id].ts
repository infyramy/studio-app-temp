import db from "../../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    // Validate required fields
    if (!body.title || !body.desc || typeof body.price !== "number") {
      throw createError({
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    // Update addon
    await db("addon")
      .where({ id })
      .update({
        title: body.title,
        desc: body.desc,
        price: body.price,
        image: body.image || null,
      });

    return {
      statusCode: 200,
      status: "success",
      message: "Addon updated successfully",
    };
  } catch (error) {
    console.error("Error updating addon:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update addon",
    });
  }
});
