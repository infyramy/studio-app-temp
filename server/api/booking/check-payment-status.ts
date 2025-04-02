import { defineEventHandler, createError } from "h3";
import knex from "~/server/utils/knex";
import { redis } from "~/server/utils/redis";

const CACHE_DURATION = 60; // 1 minute cache
const STATUS_MAP = {
  1: "pending",
  2: "partial",
  3: "completed",
  4: "failed",
} as const;

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const purchaseId = query.purchase_id as string;

    if (!purchaseId) {
      throw createError({
        statusCode: 400,
        message: "Purchase ID is required",
      });
    }

    // Try to get status from Redis cache first
    const cacheKey = `payment_status:${purchaseId}`;
    const cachedStatus = await redis.get(cacheKey);
    
    if (cachedStatus) {
      return {
        status: STATUS_MAP[cachedStatus as keyof typeof STATUS_MAP] || cachedStatus,
        message: "Payment status retrieved from cache",
        cached: true
      };
    }

    // If not in cache, check database with retry logic
    let retries = 3;
    let booking = null;

    while (retries > 0 && !booking) {
      try {
        [booking] = await knex("booking")
          .select("status")
          .where("payment_ref_number", purchaseId)
          .limit(1);
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
      }
    }

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    // Cache the status for 1 minute
    await redis.set(cacheKey, booking.status, "EX", CACHE_DURATION);

    return {
      status: STATUS_MAP[booking.status as keyof typeof STATUS_MAP] || booking.status,
      message: "Payment status retrieved from database",
      cached: false
    };
  } catch (error: any) {
    console.error("Error checking payment status:", error);
    
    // Handle specific error cases
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    // For database errors, return a temporary error status
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return {
        status: "error",
        message: "Temporary database error, please try again",
        retryable: true
      };
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to check payment status",
    });
  }
}); 