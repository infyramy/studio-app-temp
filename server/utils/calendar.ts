import db from "./knex";
import { google } from "googleapis";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface VendorCredentials {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  refresh_token?: string;
  calendar_id?: string;
}

// Function to get vendor credentials
export async function getVendorCredentials(): Promise<VendorCredentials> {
  try {
    const CLIENT_ID = await db("config")
      .where("code", "google_client_id")
      .first();

    const CLIENT_SECRET = await db("config")
      .where("code", "google_client_secret")
      .first();

    const REDIRECT_URI = await db("config")
      .where("code", "google_redirect_uri")
      .first();

    const REFRESH_TOKEN = await db("config")
      .where("code", "google_refresh_token")
      .first();

    const CALENDAR_ID = await db("config")
      .where("code", "google_calendar_id")
      .first();

    return {
      client_id: CLIENT_ID.value,
      client_secret: CLIENT_SECRET.value,
      redirect_uri: REDIRECT_URI.value,
      refresh_token: REFRESH_TOKEN.value,
      calendar_id: CALENDAR_ID.value,
    };
  } catch (error) {
    console.error(`Failed to get google calendar credentials :`, error);
    throw error;
  }
}

// Function to update refresh token
export async function updateVendorRefreshToken(refreshToken: string) {
  try {
    await db("config").where("code", "google_refresh_token").update({
      value: refreshToken,
    });
  } catch (error) {
    console.error(`Failed to update refresh token for google calendar:`, error);
    throw error;
  }
}

// Function to create calendar event
export async function createCalendarEvent(bookingData: any) {
  try {
    const credentials = await getVendorCredentials();

    console.log("Booking Data:", bookingData);

    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    oauth2Client.setCredentials({
      refresh_token: credentials.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Validate and format the date and time
    if (!bookingData.session_date || !bookingData.session_time) {
      throw new Error("Session date and time are required");
    }

    // Format the date to YYYY-MM-DD
    let dateStr = bookingData.session_date;
    if (dateStr instanceof Date) {
      dateStr = dayjs(dateStr).format("YYYY-MM-DD");
    } else if (typeof dateStr === "string" && dateStr.includes("GMT")) {
      dateStr = dayjs(dateStr).format("YYYY-MM-DD");
    }

    // Ensure time is in HH:mm:ss format
    let timeStr = bookingData.session_time;
    if (!timeStr.includes(":")) {
      throw new Error("Invalid time format");
    }
    if (timeStr.split(":").length === 2) {
      timeStr = `${timeStr}:00`;
    }

    // Create start datetime in Malaysia timezone
    const startDateTime = dayjs.tz(
      `${dateStr} ${timeStr}`,
      "Asia/Kuala_Lumpur"
    );
    console.log("Start Date (Malaysia Time):", startDateTime.format());

    // Validate the date object
    if (!startDateTime.isValid()) {
      throw new Error(
        `Invalid date-time combination: date=${dateStr}, time=${timeStr}`
      );
    }

    // Get slot configuration for duration
    const slotConfig = await db("slot_config")
      .where("title", "Main Slot")
      .first();

    if (!slotConfig || !slotConfig.duration) {
      throw new Error("Invalid slot configuration");
    }

    // Calculate end time using slot duration (in minutes)
    const endDateTime = startDateTime.add(slotConfig.duration, "minute");

    const event = {
      summary: `Photoshoot: ${bookingData.user_fullname}`,
      description: `
Theme: ${bookingData.theme}
Customer: ${bookingData.user_fullname}
Email: ${bookingData.user_email}
Phone: ${bookingData.user_phoneno}
Booking Ref: ${bookingData.ref}
Duration: ${slotConfig.duration} minutes
${bookingData.referral_code ? `Referral: ${bookingData.referral_code}` : ""}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kuala_Lumpur",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kuala_Lumpur",
      },
      attendees: [
        { email: bookingData.user_email, responseStatus: "accepted" },
      ],
    };

    console.log("Calendar event:", event);

    const response = await calendar.events.insert({
      calendarId: credentials.calendar_id || "primary",
      requestBody: event,
      sendUpdates: "all",
    });

    console.log("Response:", response);

    // Update booking with calendar event id
    await db("booking").where("id", bookingData.booking_id).update({
      calendar_event_id: response.data.id,
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    };
  } catch (error: any) {
    console.error("Failed to create calendar event:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to delete calendar event
export async function deleteCalendarEvent(bookingData: any) {
  try {
    const credentials = await getVendorCredentials();

    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    oauth2Client.setCredentials({
      refresh_token: credentials.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: credentials.calendar_id || "primary",
      eventId: bookingData.calendar_event_id,
      sendUpdates: "all", // Notify attendees about the cancellation
    });

    // Update booking with calendar event id
    await db("booking").where("id", bookingData.booking_id).update({
      calendar_event_id: null,
    });

    return {
      success: true,
      message: "Calendar event successfully deleted",
    };
  } catch (error: any) {
    console.error("Failed to delete calendar event:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to update calendar event
export async function updateCalendarEvent(eventId: string, bookingData: any) {
  try {
    const credentials = await getVendorCredentials();

    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    oauth2Client.setCredentials({
      refresh_token: credentials.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Validate and format the date and time
    if (!bookingData.session_date || !bookingData.session_time) {
      throw new Error("Session date and time are required");
    }

    // Format the date to YYYY-MM-DD
    let dateStr = bookingData.session_date;
    if (dateStr instanceof Date) {
      dateStr = dateStr.toISOString().split("T")[0];
    } else if (typeof dateStr === "string" && dateStr.includes("GMT")) {
      dateStr = new Date(dateStr).toISOString().split("T")[0];
    }

    // Ensure time is in HH:mm:ss format
    let timeStr = bookingData.session_time;
    if (!timeStr.includes(":")) {
      throw new Error("Invalid time format");
    }
    if (timeStr.split(":").length === 2) {
      timeStr = `${timeStr}:00`;
    }

    // Create start date by combining date and time
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const [year, month, day] = dateStr.split("-").map(Number);

    // Create date in local timezone (Asia/Kuala_Lumpur)
    const startDateTime = new Date(
      Date.UTC(year, month - 1, day, hours - 8, minutes, seconds)
    );

    // Validate the date object
    if (isNaN(startDateTime.getTime())) {
      throw new Error(
        `Invalid date-time combination: date=${dateStr}, time=${timeStr}`
      );
    }

    // Get slot configuration for duration
    const slotConfig = await db("slot_config")
      .where("title", "Main Slot")
      .first();

    if (!slotConfig || !slotConfig.duration) {
      throw new Error("Invalid slot configuration");
    }

    // Calculate end time using slot duration (in minutes)
    const durationInMs = slotConfig.duration * 60 * 1000;
    const endDateTime = new Date(startDateTime.getTime() + durationInMs);

    const event = {
      summary: `Photoshoot: ${bookingData.user_fullname}`,
      description: `
Theme: ${bookingData.theme}
Customer: ${bookingData.user_fullname}
Email: ${bookingData.user_email}
Phone: ${bookingData.user_phoneno}
Booking Ref: ${bookingData.ref}
Duration: ${slotConfig.duration} minutes
${bookingData.referral ? `Referral: ${bookingData.referral}` : ""}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kuala_Lumpur",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kuala_Lumpur",
      },
      attendees: [
        { email: bookingData.user_email, responseStatus: "accepted" },
      ],
    };

    const response = await calendar.events.update({
      calendarId: credentials.calendar_id || "primary",
      eventId: eventId,
      requestBody: event,
      sendUpdates: "all", // Notify attendees about the update
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    };
  } catch (error: any) {
    console.error("Failed to update calendar event:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
