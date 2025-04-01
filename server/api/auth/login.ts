import db from "../../utils/knex";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// JWT secret should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

function generateTokens(user: any) {
  // Create access token
  const accessToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      type: "access",
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  // Create refresh token
  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: "refresh",
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  console.log("Generated access token:", accessToken);
  console.log("JWT Secret used:", JWT_SECRET);

  // Verify the token immediately to ensure it's valid
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    console.log("Token verification successful:", decoded);
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  return { accessToken, refreshToken };
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Login attempt for username:", body.username);

    // Input validation
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: "Username and password are required",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");

    console.log("Looking for user in database...");

    // First check if user exists
    const user = await db("user").where("username", body.username).first();

    if (!user) {
      console.log("User not found");
      throw createError({
        statusCode: 401,
        message: "Invalid username or password",
      });
    }

    console.log("User found, checking password...");

    // Then check password separately for better debugging
    const passwordMatch = user.password === hashedPassword;
    if (!passwordMatch) {
      console.log("Password mismatch");
      throw createError({
        statusCode: 401,
        message: "Invalid username or password",
      });
    }

    console.log("Password matched, generating tokens...");

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Get studio email
    const studioEmail = await db("config")
      .where("code", "company_email")
      .first();

    // Prepare user data (excluding sensitive information)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: studioEmail.value,
      role: user.role,
    };

    // Set HTTP-only cookie for refresh token
    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return {
      status: "success",
      message: "Login successful",
      data: {
        user: userData,
        token: accessToken,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);

    // Ensure we're returning proper error responses
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An error occurred during login",
    });
  }
});
