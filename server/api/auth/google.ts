import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getVendorCredentials } from '../../utils/calendar';

export async function GET(request: Request) {
  try {
    // Get vendor ID from query params
    const url = new URL(request.url);
    const vendorId = url.searchParams.get('vendor');

    if (!vendorId) {
      return new Response('Vendor ID is required', { status: 400 });
    }

    const credentials = getVendorCredentials(vendorId);
    
    if (!credentials.client_id || !credentials.client_secret || !credentials.redirect_uri) {
      return new Response('Invalid vendor credentials', { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'consent',  // Force consent screen to get refresh token
      state: vendorId    // Pass vendor ID to callback
    });

    // Redirect to Google's OAuth page
    return Response.redirect(authUrl);
  } catch (error: any) {
    console.error('OAuth initialization error:', error);
    return new Response(error.message, { status: 500 });
  }
} 