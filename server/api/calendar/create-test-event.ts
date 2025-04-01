import { H3Event } from "h3";
import { createCalendarEvent } from "../../utils/calendar";

interface TestEventData {
  fullname: string;
  email: string;
  phone: string;
  theme: string;
  date: string;
  time: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<TestEventData>(event);
    console.log("Received body:", body);

    // Get company email from config
    const companyEmail = await knex("config")
      .select("value")
      .where("code", "company_email")
      .first();
    console.log("Company email:", companyEmail);

    if (!companyEmail) {
      throw createError({
        statusCode: 500,
        message: "Company email not configured",
      });
    }

    // Format the booking data for calendar event creation
    const bookingData = {
      id: Date.now(), // Use timestamp as temporary ID
      user_fullname: body.fullname,
      user_email: body.email,
      user_phoneno: body.phone,
      theme: body.theme,
      ref: `TEST-${Date.now()}`,
      session_date: body.date,
      session_time: body.time,
    };

    // Create calendar event
    console.log("Creating test calendar event:", bookingData);
    const calendarResult = await createCalendarEvent(
      bookingData,
      companyEmail.value
    );

    console.log("Calendar result:", calendarResult);

    if (!calendarResult.success) {
      throw createError({
        statusCode: 500,
        message: calendarResult.error || "Failed to create calendar event",
      });
    }

    return {
      status: "success",
      message: "Calendar event created successfully",
      data: {
        eventId: calendarResult.eventId,
        eventLink: calendarResult.htmlLink,
      },
    };
  } catch (error: any) {
    console.error("Error creating test calendar event:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});
