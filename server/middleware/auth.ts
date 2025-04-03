import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/refresh",
  "/api/auth/verify",
  "/api/booking/get-config",
  "/api/booking/get-themes",
  "/api/booking/get-addons",
  "/api/booking/get-slots",
  "/api/booking/get-available-slots",
  "/api/booking/proceed",
  "/api/booking/receipt-detail",
  "/api/booking/payment-callback",
  "/api/auth/google/init",
  "/api/auth/google/callback",
  "/api/setting/get-landing-page",
  "/api/booking/get-date-range",
  "/api/setting/get-organization",
  "/api/booking/update-payment-failed",
  "/api/booking/update-status",
  "/api/booking/check-payment-status",
  "/api/setting/get-holidays",
];

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const path = url.pathname;
  
    // console.log("\n=== Auth Middleware ===");
    // console.log("Request path:", path);
    // console.log("Request method:", event.method);

  // Skip auth check for public routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => path.startsWith(route));
  if (isPublicRoute) {
    // console.log("Public route detected, skipping auth");
    return;
  }

  // Skip auth for non-API routes
  if (!path.startsWith('/api/')) {
    // console.log("Non-API route detected, skipping auth");
    return;
  }

  // console.log("Protected route detected, checking authentication...");

  try {
    // Get token from Authorization header
    const authHeader = getHeader(event, "Authorization");
    // console.log("Authorization header:", authHeader ? "Present" : "Missing");

    if (!authHeader?.startsWith("Bearer ")) {
      // console.log("No Bearer token found in Authorization header");
      throw createError({
        statusCode: 401,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Token extracted from header");
    
    try {
      // console.log("Attempting to verify token with JWT_SECRET");
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        username: string;
        type: string;
      };

      // console.log("Token successfully decoded for user:", decoded.username);
      // console.log("Token type:", decoded.type);

      // Validate token type
      if (decoded.type !== "access") {
        // console.log("Invalid token type detected:", decoded.type);
        throw createError({
          statusCode: 401,
          message: "Invalid token type",
        });
      }

      // Add user info to event context for use in route handlers
      event.context.auth = {
        userId: decoded.userId,
        username: decoded.username,
      };

      // console.log("Authentication successful for user:", decoded.username);
      // console.log("=== End Auth Middleware ===\n");

    } catch (jwtError) {
      // console.error("JWT verification failed:", jwtError);
      if (jwtError instanceof jwt.JsonWebTokenError) {
        // console.log("JWT Error type:", jwtError.name);
        // console.log("JWT Error message:", jwtError.message);
      }
      throw createError({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }
  } catch (error: any) {
    // console.error("Auth middleware error:", error);
    // console.log("=== End Auth Middleware (with error) ===\n");
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Authentication error",
    });
  }
});
