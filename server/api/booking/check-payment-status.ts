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
  private readonly rateLimits: Map<string, { count: number, timestamp: number }>;
  private readonly maxRequestsPerMinute: number;

  constructor(maxSize: number = 1000, ttl: number = 5000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl; // Increased TTL to 5 seconds to reduce load
    this.cleanupInterval = 30000; // Cleanup every 30 seconds
    this.maxRetries = 3;
    this.rateLimits = new Map();
    this.maxRequestsPerMinute = 20; // 20 requests per minute per IP
    
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
    
    // Clean cache
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
    
    // Clean rate limits
    for (const [ip, data] of this.rateLimits.entries()) {
      if (now - data.timestamp > 60000) {
        this.rateLimits.delete(ip);
      }
    }
  }

  shouldRetry(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return entry.retryCount < this.maxRetries;
  }
  
  // Rate limiting by IP
  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(ip);
    
    if (!entry) {
      this.rateLimits.set(ip, { count: 1, timestamp: now });
      return false;
    }
    
    // Reset counter if more than a minute has passed
    if (now - entry.timestamp > 60000) {
      this.rateLimits.set(ip, { count: 1, timestamp: now });
      return false;
    }
    
    // Check if limit exceeded
    if (entry.count >= this.maxRequestsPerMinute) {
      return true;
    }
    
    // Increment counter
    this.rateLimits.set(ip, { count: entry.count + 1, timestamp: entry.timestamp });
    return false;
  }
}

// Create cache instance with reasonable limits
const statusCache = new PaymentStatusCache(1000, 5000); // 1000 entries, 5 second TTL

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const purchaseId = query.purchase_id as string;
    
    // Get client IP for rate limiting
    const ip = getRequestHeader(event, 'x-forwarded-for') || 
               getRequestHeader(event, 'x-real-ip') || 
               getRequestHeader(event, 'cf-connecting-ip') || 
               'unknown';
    
    // Apply rate limiting
    if (statusCache.isRateLimited(ip)) {
      return {
        status: "error",
        message: "Rate limit exceeded. Please wait before trying again.",
        retryable: true,
        retryAfter: 60
      };
    }

    if (!purchaseId) {
      throw createError({
        statusCode: 400,
        message: "Purchase ID is required",
      });
    }

    // Check cache first
    const cachedStatus = statusCache.get(purchaseId);
    if (cachedStatus) {
      console.log(`Returning cached status for ${purchaseId}: ${cachedStatus.status}`);
      return {
        status: cachedStatus.status,
        message: "Payment status retrieved from cache",
        cached: true,
        retryCount: cachedStatus.retryCount
      };
    }

    // Check if we should retry based on previous attempts
    if (!statusCache.shouldRetry(purchaseId)) {
      return {
        status: "error",
        message: "Maximum retry attempts reached. Please contact support.",
        retryable: false
      };
    }

    // Get booking details
    const [booking] = await knex("booking")
      .select("status", "payment_ref_number", "payment_initiated_at")
      .where("chip_purchase_id", purchaseId)
      .whereIn("status", [1, 2, 3, 4])
      .limit(1);

    if (!booking) {
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
      
      if (diffMinutes > 30 && booking.status === 1) {
        // Update booking status to failed
        await knex("booking")
          .where("chip_purchase_id", purchaseId)
          .update({ status: 4 });
        
        return {
          status: "failed",
          message: "Payment session expired",
          retryable: false
        };
      }
    }

    const status = STATUS_MAP[booking.status as keyof typeof STATUS_MAP] || booking.status;
    console.log(`Status for ${purchaseId} from database: ${status}`);

    // Update cache with longer TTL for completed/failed statuses
    const ttl = (status === 'completed' || status === 'failed') ? 30000 : 5000;
    statusCache.set(purchaseId, status);

    return {
      status,
      message: "Payment status retrieved successfully",
      cached: false,
      retryCount: 0
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