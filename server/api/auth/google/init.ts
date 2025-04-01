import { google } from "googleapis";
import { getVendorCredentials } from "../../../utils/calendar";

export default defineEventHandler(async (event) => {
  try {
    const credentials = await getVendorCredentials();

    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
      prompt: "consent",
    });

    return sendRedirect(event, authUrl);
  } catch (error: any) {
    console.error("OAuth initialization error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to initialize OAuth",
    });
  }
});
