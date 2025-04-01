import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("body", body);
    
    // Validate required fields
    if (!body.title || !body.desc || typeof body.price !== 'number') {
      throw createError({
        statusCode: 400,
        message: "Missing required fields"
      });
    }

    // Insert new addon
    const [addonId] = await db("addon").insert({
      title: body.title,
      desc: body.description,
      price: body.price,
      image: body.image || null,
      status: 1, // Active by default
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Addon created successfully"
    };
  } catch (error) {
    console.error("Error creating addon:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create addon"
    });
  }
}); 