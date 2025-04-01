import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const { clientId, clientSecret, redirectUri, refreshToken } =
      await readBody(event);

    await db("config")
      .where("code", "google_client_id")
      .update({ value: clientId });

    await db("config")
      .where("code", "google_client_secret")
      .update({ value: clientSecret });

    await db("config")
      .where("code", "google_redirect_uri")
      .update({ value: redirectUri });

    await db("config")
      .where("code", "google_refresh_token")
      .update({ value: refreshToken });

    return {
      statusCode: 200,
      status: "success",
    };
  } catch (error) {
    console.error("Error updating configurations:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update configurations",
    });
  }
});
