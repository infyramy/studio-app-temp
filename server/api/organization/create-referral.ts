import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { referral, member } = body;

    // Check if referral already exists
    const existingReferral = await db("referral").where("referral", referral).first();
    if (existingReferral) {
      return {
        statusCode: 400,
        status: "error",
        message: "Referral code already exists",
      };
    }

    const referralData = await db("referral").insert({
      referral: referral,
      member: member,
      status: 1
    });

    if (!referralData) {
      return {
        statusCode: 400,
        status: "error",
        message: "Failed to create referral",
      };
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Referral created successfully",
    };
  } catch (error) {
    console.error("Error creating referral:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create referral",
    });
  }
});
