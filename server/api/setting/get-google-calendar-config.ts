import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const clientId = await db("config")
      .where("code", "google_client_id")
      .select("value")
      .first();

    const clientSecret = await db("config")
      .where("code", "google_client_secret")
      .select("value")
      .first();

    const redirectUri = await db("config")
      .where("code", "google_redirect_uri")
      .select("value")
      .first();

    const refreshToken = await db("config")
      .where("code", "google_refresh_token")
      .select("value")
      .first();

    return {
      statusCode: 200,
      status: "success",
      data: {
        clientId: clientId.value,
        clientSecret: clientSecret.value,
        redirectUri: redirectUri.value,
        refreshToken: refreshToken.value,
      },
    };
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch configurations",
    });
  }
});
