import db from "../../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    // Delete theme
    await db("theme")
      .where({ id })
      .del();

    return {
      statusCode: 200,
      status: "success",
      message: "Theme deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting theme:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete theme"
    });
  }
}); 