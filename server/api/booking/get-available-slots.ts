import db from "../../utils/knex";
import dayjs from "../../utils/date";

interface TimeSlot {
  slot: string;
  value: string;
}

interface BreakTime {
  id: number;
  start_time: string;
  end_time: string;
}

interface CustomError extends Error {
  statusCode?: number;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { date, theme_id } = query;

    console.log("date", date);
    console.log("theme_id", theme_id);

    if (!date || typeof date !== "string") {
      throw createError({
        statusCode: 400,
        message: "Date parameter is required",
      });
    }

    if (!theme_id) {
      throw createError({
        statusCode: 400,
        message: "Theme ID is required",
      });
    }

    const now = dayjs();
    const isToday = now.format("YYYY-MM-DD") === date;

    // Get slot configuration
    const slotConfig = await db("slot_config")
      .where("title", "Main Slot")
      .first();

    if (!slotConfig) {
      throw createError({
        statusCode: 404,
        message: "Slot configuration not found",
      });
    }

    // Get break times
    const breakTimes = await db("break_time").select("*");

    // Get existing bookings for the date and theme
    const bookings = await db("booking")
      .where("session_date", date)
      .where("theme", theme_id)
      .whereNot("status", 4)
      .select("session_time");

    const slots: TimeSlot[] = [];

    // Convert times to dayjs objects
    let startTime;
    if (isToday) {
      // For today, start from the next 30-minute mark from current time
      const currentTime = dayjs();
      const minutes = currentTime.minute();
      const roundedMinutes = Math.ceil((minutes + 30) / 30) * 30;
      startTime = currentTime.startOf("hour").add(roundedMinutes, "minute");

      // If we've rounded past the current hour, make sure we're still on the same day
      if (startTime.isBefore(currentTime)) {
        startTime = startTime.add(30, "minute");
      }
    } else {
      startTime = dayjs(`${date} ${slotConfig.start_time}`);
    }

    const endTime = dayjs(`${date} ${slotConfig.end_time}`);

    // If start time is after end time for today, return empty slots
    if (startTime.isAfter(endTime)) {
      return {
        status: "success",
        data: [],
        interval: slotConfig.duration,
        rest: slotConfig.rest,
      };
    }

    // Convert break times to dayjs objects
    const breaks = breakTimes.map((breakTime) => ({
      start: dayjs(`${date} ${breakTime.start_time}`),
      end: dayjs(`${date} ${breakTime.end_time}`),
    }));

    // Generate slots
    let currentSlot = startTime;
    const slotDuration = slotConfig.duration;
    const restDuration = slotConfig.rest;

    while (currentSlot.isBefore(endTime)) {
      // Check if current slot is during a break
      const isDuringBreak = breaks.some(
        (breakTime) =>
          (currentSlot.isSameOrAfter(breakTime.start) &&
            currentSlot.isBefore(breakTime.end)) ||
          // Also check if the slot plus its duration would overlap with break time
          (currentSlot.isBefore(breakTime.end) &&
            currentSlot.add(slotDuration, 'minute').isAfter(breakTime.start))
      );

      // Check if slot is already booked
      const isBooked = bookings.some(
        (booking) => booking.session_time === currentSlot.format("HH:mm:ss")
      );

      // For today, only add future slots
      const isValidSlot = !isToday || currentSlot.isAfter(dayjs());

      if (!isDuringBreak && !isBooked && isValidSlot) {
        slots.push({
          slot: currentSlot.format("hh:mm A"),
          value: currentSlot.format("HH:mm:ss"),
        });
      }

      // Move to next slot
      currentSlot = currentSlot.add(slotDuration + restDuration, "minute");
    }

    return {
      status: "success",
      data: slots,
      interval: slotDuration,
      rest: restDuration,
    };
  } catch (error: any) {
    console.error("Error in get-available-slots:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to get available slots",
    });
  }
});
