import db from "../../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    // Validate status
    if (typeof body.status !== "number" || ![0, 1].includes(body.status)) {
      throw createError({
        statusCode: 400,
        message: "Invalid status value",
      });
    }

    // Update addon status
    await db("addon").where({ id }).update({
      status: body.status,
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Addon status updated successfully",
    };
  } catch (error) {
    console.error("Error updating addon status:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update addon status",
    });
  }
});
