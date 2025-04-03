import { defineEventHandler, createError } from "h3";
import knex from "~/server/utils/knex";

const STATUS_MAP = {
  1: "pending",
  2: "partial",
  3: "completed",
  4: "failed",
} as const;

// Optimized cache with size limits and cleanup
class PaymentStatusCache {
  private cache: Map<string, { 
    status: string; 
    timestamp: number;
    lastCheck: number;
    retryCount: number;
  }>;
  private readonly maxSize: number;
  private readonly ttl: number;
  private readonly cleanupInterval: number;
  private readonly maxRetries: number;

  constructor(maxSize: number = 1000, ttl: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.cleanupInterval = 5000; // Cleanup every 5 seconds
    this.maxRetries = 3;
    
    // Start cleanup interval
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  get(key: string): { 
    status: string; 
    timestamp: number;
    lastCheck: number;
    retryCount: number;
  } | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry;
  }

  set(key: string, status: string): void {
    // If cache is full, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }
    
    const existing = this.cache.get(key);
    this.cache.set(key, {
      status,
      timestamp: Date.now(),
      lastCheck: Date.now(),
      retryCount: existing ? existing.retryCount + 1 : 0
    });
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  shouldRetry(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return entry.retryCount < this.maxRetries;
  }
}

// Create cache instance with reasonable limits
const statusCache = new PaymentStatusCache(1000, 1000); // 1000 entries, 1 second TTL

export default defineEventHandler(async (event) => {
  try {
    console.log("------- Checking payment status -------");
    const query = getQuery(event);
    const purchaseId = query.purchase_id as string;

    if (!purchaseId) {
      console.error("Missing purchase_id in query");
      throw createError({
        statusCode: 400,
        message: "Purchase ID is required",
      });
    }

    console.log("Checking status for purchase ID:", purchaseId);

    // Check cache first
    const cachedStatus = statusCache.get(purchaseId);
    if (cachedStatus) {
      console.log("Retrieved status from cache:", cachedStatus);
      return {
        status: cachedStatus.status,
        message: "Payment status retrieved from cache",
        cached: true,
        retryCount: cachedStatus.retryCount
      };
    }

    // Check if we should retry based on previous attempts
    if (!statusCache.shouldRetry(purchaseId)) {
      console.log("Maximum retry attempts reached for purchase ID:", purchaseId);
      return {
        status: "error",
        message: "Maximum retry attempts reached. Please contact support.",
        retryable: false
      };
    }

    // Get booking details
    const [booking] = await knex("booking")
      .select("status", "payment_ref_number", "payment_initiated_at", "payment_status")
      .where("chip_purchase_id", purchaseId)
      .whereIn("status", [1, 2, 3, 4])
      .limit(1);

    console.log("Found booking:", booking);

    if (!booking) {
      console.error("No booking found for purchase ID:", purchaseId);
      throw createError({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    // Check if payment has expired (30 minutes)
    if (booking.payment_initiated_at) {
      const initiatedAt = new Date(booking.payment_initiated_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - initiatedAt.getTime()) / (1000 * 60);
      
      console.log("Payment initiated:", initiatedAt);
      console.log("Time elapsed (minutes):", diffMinutes);
      
      if (diffMinutes > 30 && booking.status === 1) {
        console.log("Payment session expired");
        // Update booking status to failed
        await knex("booking")
          .where("chip_purchase_id", purchaseId)
          .update({ 
            status: 4,
            payment_status: "expired",
            updated_at: new Date()
          });
        
        return {
          status: "failed",
          message: "Payment session expired",
          retryable: false
        };
      }
    }

    const status = STATUS_MAP[booking.status as keyof typeof STATUS_MAP] || booking.status;
    console.log("Current booking status:", {
      rawStatus: booking.status,
      mappedStatus: status,
      paymentStatus: booking.payment_status
    });

    // Update cache
    statusCache.set(purchaseId, status);
    console.log("Updated status cache for purchase ID:", purchaseId);

    return {
      status,
      message: "Payment status retrieved successfully",
      cached: false,
      retryCount: 0,
      paymentStatus: booking.payment_status
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