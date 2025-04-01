import { google } from "googleapis";
import {
  getVendorCredentials,
  updateVendorRefreshToken,
} from "../../../utils/calendar";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const code = query.code as string;

    if (!code) {
      throw createError({
        statusCode: 400,
        message: "Missing required parameters",
      });
    }

    const credentials = await getVendorCredentials();

    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    // Get tokens from code
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      throw createError({
        statusCode: 400,
        message:
          "No refresh token received. Please revoke access and try again.",
      });
    }

    // Store the refresh token in database
    await updateVendorRefreshToken(tokens.refresh_token);

    return new Response(
      `
      <html>
        <body>
          <h1>Successfully authenticated!</h1>
          <p>Google Calendar has been connected successfully.</p>
          <p>You can close this window now.</p>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error: any) {
    console.error("OAuth callback error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "OAuth callback failed",
    });
  }
});
