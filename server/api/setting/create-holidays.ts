import db from "../../utils/knex";

interface CreateHolidayBody {
  startDate: string;
  endDate: string;
  description: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body: CreateHolidayBody = await readBody(event);

    // Validate request body
    if (!body.startDate || !body.endDate || !body.description) {
      return {
        statusCode: 400,
        message: "Start date, end date, and description are required",
      };
    }

    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    if (endDate < startDate) {
      return {
        statusCode: 400,
        message: "End date must be after start date",
      };
    }

    // Check for overlapping holidays
    const existingHolidays = await db("holidays").whereRaw(
      `start_date <= '${body.endDate}' AND end_date >= '${body.startDate}'`
    );

    if (existingHolidays.length > 0) {
      return {
        statusCode: 400,
        message: "New holiday dates overlap with existing holidays",
      };
    }

    // Insert new holiday
    const newHoliday = await db("holidays").insert({
      start_date: body.startDate,
      end_date: body.endDate,
      description: body.description,
    });

    return {
      statusCode: 200,
      message: "Holiday created successfully",
      data: {
        holiday: {
          id: newHoliday[0],
          start_date: body.startDate,
          end_date: body.endDate,
          description: body.description,
        },
      },
    };
  } catch (error) {
    console.error("Error creating holiday:", error);
    return {
      statusCode: 500,
      message: "Failed to create holiday",
    };
  }
});
