import db from "../../utils/knex";
import crypto from 'crypto';

interface CustomError extends Error {
  statusCode?: number;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { currentPassword, newPassword, confirmPassword } = body;

    const user = await db("user").where("username", "admin").first();

    // Hash the current password for comparison
    const currentPasswordHash = crypto.createHash('md5').update(currentPassword).digest('hex');
    
    // Verify current password
    if (currentPasswordHash !== user.password) {
      throw createError({
        statusCode: 400,
        message: "Current password is incorrect",
      });
    }

    if (newPassword !== confirmPassword) {
      throw createError({
        statusCode: 400,
        message: "New password and confirm password do not match",
      });
    }

    // Hash the new password
    const newPasswordHash = crypto.createHash('md5').update(newPassword).digest('hex');
    console.log(newPasswordHash);

    // Update the password in database
    await db("user")
      .where("username", "admin")
      .update({
        password: newPasswordHash
      });

    return {
      statusCode: 200,
      status: "success",
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    const customError = error as CustomError;
    throw createError({
      statusCode: customError.statusCode || 500,
      message: customError.message || "Failed to update password",
    });
  }
});
