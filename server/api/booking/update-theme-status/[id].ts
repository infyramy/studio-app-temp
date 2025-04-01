import db from "../../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    // Validate status
    if (typeof body.status !== 'number' || ![0, 1].includes(body.status)) {
      throw createError({
        statusCode: 400,
        message: "Invalid status value"
      });
    }

    // Update theme status
    await db("theme")
      .where({ id })
      .update({
        status: body.status,
      });

    return {
      message: "Theme status updated successfully"
    };
  } catch (error) {
    console.error("Error updating theme status:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update theme status"
    });
  }
}); 