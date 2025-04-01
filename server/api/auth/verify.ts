import jwt from "jsonwebtoken";
import db from "../../utils/knex";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JWTPayload {
  userId: number;
  username?: string;
  type: "access" | "refresh";
  exp?: number;
}

export default defineEventHandler(async (event) => {
  try {
    // Get token from Authorization header
    const authHeader = getHeader(event, "Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // Check token type
      if (decoded.type !== "access") {
        throw createError({
          statusCode: 401,
          message: "Invalid token type",
        });
      }

      // Check token expiration
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        throw createError({
          statusCode: 401,
          message: "Token expired",
        });
      }

      // Get user from database to ensure they still exist
      const user = await db("user")
        .where("id", decoded.userId)
        .first();

      if (!user) {
        throw createError({
          statusCode: 401,
          message: "User not found",
        });
      }

      return {
        statusCode: 200,
        status: "success",
        message: "Token is valid",
      };
    } catch (jwtError) {
      throw createError({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Token verification failed",
    });
  }
}); 