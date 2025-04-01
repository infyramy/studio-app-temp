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

    if (!credentials.refresh_token) {
      return {
        isAuthorized: false,
        message: "Google Calendar is not connected",
      };
    }

    oauth2Client.setCredentials({
      refresh_token: credentials.refresh_token,
    });

    // Try to get a new access token
    await oauth2Client.getAccessToken();

    return {
      isAuthorized: true,
      message: "Google Calendar is connected",
    };
  } catch (error: any) {
    console.error("Error checking Google Calendar status:", error);

    return {
      isAuthorized: false,
      message: "Google Calendar is not connected",
      error: error.message,
    };
  }
});
