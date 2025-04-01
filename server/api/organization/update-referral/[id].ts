import db from "../../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const body = await readBody(event);
    const { referral, member, status } = body;

    // Check if referral exists
    const existingReferral = await db("referral").where("id", id).first();
    if (!existingReferral) {
      throw createError({
        statusCode: 404,
        message: "Referral not found",
      });
    }

    // Check if new referral code already exists (if code is being changed)
    if (referral !== existingReferral.referral) {
      const duplicateReferral = await db("referral")
        .where("referral", referral)
        .whereNot("id", id)
        .first();
      
      if (duplicateReferral) {
        throw createError({
          statusCode: 400,
          message: "Referral code already exists",
        });
      }
    }

    // Update referral
    const updatedReferral = await db("referral")
      .where("id", id)
      .update({
        referral: referral,
        member: member,
        status: status,
      });

    if (!updatedReferral) {
      throw createError({
        statusCode: 400,
        message: "Failed to update referral",
      });
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Referral updated successfully",
    };
  } catch (error) {
    console.error("Error updating referral:", error);
    throw error;
  }
}); 