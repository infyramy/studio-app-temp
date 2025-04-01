import { defineEventHandler, getQuery } from "h3";
import knex from "~/server/utils/knex";
import type { Knex } from "knex";
import db from "~/server/utils/knex";
import { createError } from "h3";

interface SlotsResponse {
  [key: string]: number;
}

interface BreakTime {
  id: number;
  start_time: string;
  end_time: string;
}

// Helper function to normalize date to YYYY-MM-DD format
function normalizeDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

// Helper function to convert UTC date string to local date string
function utcToLocalDateString(utcDate: string): string {
  const date = new Date(utcDate);
  // Subtract the offset instead of adding it (multiply by -1)
  return normalizeDate(
    new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
  );
}

// Helper function to create date
function createDate(year: number, month: number, day: number): Date {
  console.log("Year:", year);
  console.log("Month:", month);
  console.log("Day:", day);
  const date = new Date(year, month, day);
  // Adjust to start of day in local timezone
  date.setHours(0, 0, 0, 0);
  return date;
}

// Helper function to get last day of month
function getLastDayOfMonth(year: number, month: number): Date {
  // month + 1 gives us the first day of next month, then we subtract 1 day
  const date = new Date(year, month + 1, 0);
  // Adjust to start of day in local timezone
  date.setHours(0, 0, 0, 0);
  return date;
}

// Helper function to convert time string (HH:mm) to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + minutes;
}

// Helper function to get current time in minutes since midnight
function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// Helper function to calculate total break time in minutes
function calculateTotalBreakTime(breaks: BreakTime[]): number {
  return breaks.reduce((total, breakTime) => {
    const start = timeToMinutes(breakTime.start_time);
    const end = timeToMinutes(breakTime.end_time);
    return total + (end - start);
  }, 0);
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { month, year, theme_id } = query;

    // Get current date and time
    const now = new Date();
    const currentTimeInMinutes = getCurrentTimeInMinutes();
    const todayStr = normalizeDate(now);

    console.log("Current time in minutes:", currentTimeInMinutes);
    console.log("Today's date:", todayStr);

    console.log("Query:", query);

    if (!month || !year) {
      throw createError({
        statusCode: 400,
        message: "Month and year parameters are required",
      });
    }

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

    console.log("Slot config:", slotConfig);

    // Convert slot config values to numbers and validate
    const config = {
      start_time: timeToMinutes(slotConfig.start_time),
      end_time: timeToMinutes(slotConfig.end_time),
      duration: Number(slotConfig.duration),
      rest: Number(slotConfig.rest),
      start_date: slotConfig.start_date,
      end_date: slotConfig.end_date,
    };

    // Validate all config values are valid numbers
    Object.entries(config).forEach(([key, value]) => {
      if (isNaN(value)) {
        throw createError({
          statusCode: 500,
          message: `Invalid slot configuration: ${key} is not a valid number or time format`
        });
      }
    });

    console.log("Raw slot config:", slotConfig);
    console.log("Converted config (in minutes):", config);

    // Calculate total break time
    const totalBreakTime = calculateTotalBreakTime(breakTimes);

    // Validate the calculation inputs
    const availableTime = config.end_time - config.start_time;
    const slotTime = config.duration + config.rest;

    console.log("Calculation components:");
    console.log("Available time:", availableTime);
    console.log("Total break time:", totalBreakTime);
    console.log("Slot time:", slotTime);

    if (slotTime <= 0) {
      throw createError({
        statusCode: 500,
        message: "Invalid configuration: duration + rest must be greater than 0"
      });
    }

    const updatedMonth = Number(month) - 1;

    // Get the first and last day of the month
    const firstDay = createDate(Number(year), updatedMonth, 1);
    const lastDay = getLastDayOfMonth(Number(year), updatedMonth);

    console.log("First day:", firstDay);
    console.log("Last day:", lastDay);

    // Get existing bookings for the month
    const bookingsQuery = db("booking")
      .whereBetween("session_date", [
        normalizeDate(firstDay),
        normalizeDate(lastDay),
      ])
      .whereNot("status", 1)
      .select("session_date");

    // If theme_id is provided, filter bookings by theme
    if (theme_id) {
      bookingsQuery.where("theme", theme_id);
    }

    const bookings = await bookingsQuery;
    console.log("All bookings for the month:", bookings);

    // Create a map of dates to available slots
    const slotsMap: SlotsResponse = {};
    let currentDate = new Date(firstDay);

    while (currentDate <= lastDay) {
      const dateStr = normalizeDate(currentDate);
      const dayOfWeek = currentDate.getDay();

      // Only count weekdays (Monday-Friday)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        let adjustedStartTime = config.start_time;
        let adjustedAvailableTime = availableTime;

        // If it's today and current time is after start time, adjust the available time
        if (dateStr === todayStr && currentTimeInMinutes > config.start_time) {
          // Round up to the next slot
          const nextSlotStart = Math.ceil(currentTimeInMinutes / slotTime) * slotTime;
          adjustedStartTime = Math.max(nextSlotStart, currentTimeInMinutes);
          adjustedAvailableTime = config.end_time - adjustedStartTime;
          
          console.log("Current time debugging:");
          console.log(`Current time in minutes: ${currentTimeInMinutes}`);
          console.log(`Slot time (duration + rest): ${slotTime}`);
          console.log(`Next slot start: ${nextSlotStart}`);
          console.log(`Config end time: ${config.end_time}`);
          console.log(`Adjusted start time: ${adjustedStartTime}`);
          console.log(`Original available time: ${availableTime}`);
          console.log(`Adjusted available time: ${adjustedAvailableTime}`);
          console.log(`Total break time: ${totalBreakTime}`);
        }

        // Calculate total possible slots for the day
        const totalSlots = Math.floor(
          (adjustedAvailableTime - totalBreakTime) / slotTime
        );

        console.log("\nDetailed slot calculation:");
        console.log(`Date: ${dateStr}`);
        console.log(`Is today: ${dateStr === todayStr}`);
        console.log(`Available time: ${adjustedAvailableTime} minutes`);
        console.log(`Break time: ${totalBreakTime} minutes`);
        console.log(`Slot time (duration + rest): ${slotTime} minutes`);
        console.log(`Calculation: (${adjustedAvailableTime} - ${totalBreakTime}) / ${slotTime} = ${totalSlots}`);

        // Count bookings for this date
        const dateBookings = bookings.filter((booking) => {
          const localBookingDate = utcToLocalDateString(booking.session_date);
          return localBookingDate === dateStr;
        }).length;

        console.log(`Existing bookings for this date: ${dateBookings}`);
        
        // Available slots = total slots - booked slots
        slotsMap[dateStr] = Math.max(0, totalSlots - dateBookings);
        
        console.log(`Final available slots: ${slotsMap[dateStr]}\n-------------------`);
      } else {
        slotsMap[dateStr] = 0; // No slots available on weekends
      }

      console.log("Date string:", dateStr);
      console.log("Available slots:", slotsMap[dateStr]);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      status: "success",
      data: slotsMap,
    };
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch slots",
    });
  }
});
