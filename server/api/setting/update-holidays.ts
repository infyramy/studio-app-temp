import db from "../../utils/knex";

interface Holiday {
  id: number | null;
  startDate: string;
  endDate: string;
  description: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const holidays: Holiday[] = body.holidays;

    // Validate request body
    if (!Array.isArray(holidays)) {
      return {
        statusCode: 400,
        message: "Invalid request body",
      };
    }

    // Validate each holiday
    for (const holiday of holidays) {
      if (!holiday.startDate || !holiday.endDate || !holiday.description) {
        return {
          statusCode: 400,
          message:
            "All holidays must have start date, end date, and description",
        };
      }

      // Validate dates
      const startDate = new Date(holiday.startDate);
      const endDate = new Date(holiday.endDate);
      if (endDate < startDate) {
        return {
          statusCode: 400,
          message: "End date must be after start date",
        };
      }
    }

    // Start a transaction
    const existingHolidays = await db("holidays").select("id");

    // Delete holidays that are not in the new list
    const newHolidayIds = holidays
      .filter((h) => h.id !== null)
      .map((h) => h.id);
    const holidaysToDelete = existingHolidays
      .filter((h) => !newHolidayIds.includes(h.id))
      .map((h) => h.id);

    if (holidaysToDelete.length > 0) {
      await db("holidays").delete().whereIn("id", holidaysToDelete);
    }

    // Update existing holidays and insert new ones
    for (const holiday of holidays) {
      if (holiday.id) {
        // Update existing holiday
        await db("holidays")
          .update({
            start_date: holiday.startDate,
            end_date: holiday.endDate,
            description: holiday.description,
          })
          .where("id", holiday.id);
      } else {
        // Insert new holiday
        await db("holidays").insert({
          start_date: holiday.startDate,
          end_date: holiday.endDate,
          description: holiday.description,
        });
      }
    }

    return {
      statusCode: 200,
      message: "Holidays updated successfully",
    };
  } catch (error) {
    console.error("Error updating holidays:", error);
    return {
      statusCode: 500,
      message: "Failed to update holidays",
    };
  }
});
