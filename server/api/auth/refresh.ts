import jwt from "jsonwebtoken";
import db from "../../utils/knex";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const ACCESS_TOKEN_EXPIRY = "15m";

interface JWTPayload {
  userId: number;
  type: "access" | "refresh";
  exp?: number;
}

export default defineEventHandler(async (event) => {
  try {
    // Get refresh token from cookie
    const refreshToken = getCookie(event, "refreshToken");

    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        message: "No refresh token provided",
      });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JWTPayload;

      // Check token type
      if (decoded.type !== "refresh") {
        throw createError({
          statusCode: 401,
          message: "Invalid token type",
        });
      }

      // Get user from database
      const user = await db("user")
        .where("id", decoded.userId)
        .first();

      if (!user) {
        throw createError({
          statusCode: 401,
          message: "User not found",
        });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          type: "access",
        },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      // Prepare user data
      const userData = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      };

      return {
        statusCode: 200,
        status: "success",
        message: "Token refreshed successfully",
        data: {
          user: userData,
          token: accessToken,
        },
      };
    } catch (jwtError) {
      // Clear invalid refresh token
      setCookie(event, "refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });

      throw createError({
        statusCode: 401,
        message: "Invalid or expired refresh token",
      });
    }
  } catch (error: any) {
    console.error("Token refresh error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to refresh token",
    });
  }
}); 