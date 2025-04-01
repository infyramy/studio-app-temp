import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.content || typeof body.content !== "string") {
      return {
        statusCode: 400,
        message:
          "Invalid request body. Content is required and must be a string.",
      };
    }

    await db("config").where("code", "tnc").update({
      value: body.content,
    });

    return {
      statusCode: 200,
      message: "Terms and conditions updated successfully",
    };
  } catch (error) {
    console.error("Error updating terms and conditions:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
