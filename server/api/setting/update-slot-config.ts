import db from "../../utils/knex";

interface BreakTime {
  id: number | null;
  start_time: string;
  end_time: string;
  created_date?: string;
  updated_date?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      start_time,
      end_time,
      duration,
      rest,
      breaks,
      start_date,
      end_date,
    } = body;

    console.log(start_time, end_time, duration, rest);

    console.log("Breaks:", breaks);

    // Formatted start and end date (YYYY-MM-DD)
    const formattedStartDate = formatDateToLocal(start_date);
    const formattedEndDate = formatDateToLocal(end_date);

    await db("slot_config").where("title", "Main Slot").update({
      start_time,
      end_time,
      duration,
      rest,
      updated_date: db.fn.now(),
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    });

    // Get current break times from DB
    const existingBreaks = await db("break_time").select("id");
    const existingBreakIds = new Set(
      existingBreaks.map((b: { id: number }) => b.id)
    );
    const newBreakIds = new Set(
      breaks.filter((b: BreakTime) => b.id !== null).map((b: BreakTime) => b.id)
    );

    // Find break times to delete (exist in DB but not in new breaks)
    const breakIdsToDelete = [...existingBreakIds].filter(
      (id) => !newBreakIds.has(id)
    );
    if (breakIdsToDelete.length > 0) {
      await db("break_time").whereIn("id", breakIdsToDelete).delete();
    }

    // Update or insert break times
    for (const breakTime of breaks) {
      if (breakTime.id && existingBreakIds.has(breakTime.id)) {
        // Update existing break time
        await db("break_time").where("id", breakTime.id).update({
          start_time: breakTime.start_time,
          end_time: breakTime.end_time,
          updated_date: db.fn.now(),
        });
      } else {
        // Insert new break time without id
        await db("break_time").insert({
          start_time: breakTime.start_time,
          end_time: breakTime.end_time,
          created_date: db.fn.now(),
          updated_date: db.fn.now(),
        });
      }
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Slot configuration updated successfully",
    };
  } catch (error) {
    console.error("Error updating slot config:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update slot configuration",
    });
  }
});

function formatDateToLocal(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA"); // en-CA locale gives YYYY-MM-DD format
}
