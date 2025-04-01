import jwt from "jsonwebtoken";
import db from "../../utils/knex";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default defineEventHandler(async (event) => {
  try {
    // Get token from Authorization header
    const authHeader = getHeader(event, "Authorization");
    // console.log("Auth header:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No Bearer token found in header");
      throw createError({
        statusCode: 401,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Attempting to verify token:", token);
    // console.log("Using JWT_SECRET:", JWT_SECRET);

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        username: string;
        type: string;
      };
      console.log("Token successfully decoded:", decoded);

      // Validate token type
      if (decoded.type !== "access") {
        console.log("Invalid token type:", decoded.type);
        throw createError({
          statusCode: 401,
          message: "Invalid token type",
        });
      }

      // Get user from database
      console.log("Looking up user with ID:", decoded.userId);
      const user = await db("user")
        .select("id", "username")
        .where("id", decoded.userId)
        .first();

      // Get company name
      const companyName = await db("config")
        .where("code", "company_name")
        .first();

      // Get company email
      const companyEmail = await db("config")
        .where("code", "company_email")
        .first();

      if (!user) {
        console.log("No user found with ID:", decoded.userId);
        throw createError({
          statusCode: 401,
          message: "User not found",
        });
      }

      console.log("User found:", user.username);

      return {
        status: "success",
        data: {
          ...user,
          companyName: companyName?.value || "",
          companyEmail: companyEmail?.value || "",
        },
      };
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      if (jwtError instanceof jwt.JsonWebTokenError) {
        console.log("JWT Error type:", jwtError.name);
        console.log("JWT Error message:", jwtError.message);
      }
      throw createError({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }
  } catch (error: any) {
    console.error("Auth error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});
