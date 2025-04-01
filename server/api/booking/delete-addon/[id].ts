import db from "../../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    // Delete addon
    await db("addon")
      .where({ id })
      .del();

    return {
      statusCode: 200,
      status: "success",
      message: "Addon deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting addon:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete addon"
    });
  }
}); 