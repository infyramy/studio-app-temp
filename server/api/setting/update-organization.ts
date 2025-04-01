import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Body:", body);
    
    const { companyName, companyEmail, companyAddress, ssmNumber, logoUrl, wazeUrl, googleMapsUrl, bankQrCode, bankName, bankAccountNo, bankAccountHolder } = body;

    // Validate required fields
    if (!companyName || !companyEmail || !companyAddress || !ssmNumber || !logoUrl || !wazeUrl || !googleMapsUrl || !bankName || !bankAccountNo || !bankAccountHolder || !bankQrCode) {
      throw createError({
        statusCode: 400,
        message: "All fields are required",
      });
    }


    // Update company name
    await db("config").where("code", "company_name").update({
      value: companyName,
    });

    // Update company email
    await db("config").where("code", "company_email").update({
      value: companyEmail,
    });

    // Update company address
    await db("config").where("code", "company_address").update({
      value: companyAddress,
    });

    await db("config").where("code", "google_calendar_id").update({
      value: companyEmail,
    });

    // Update SSM number
    await db("config").where("code", "ssm_number").update({
      value: ssmNumber,
    });

    // Update company logo
    await db("config").where("code", "logo_url").update({
      value: logoUrl,
    });

    // Update bank QR code
    await db("config").where("code", "bank_qr_code").update({
      value: bankQrCode,
    });

    // Update bank name
    await db("config").where("code", "bank_name").update({
      value: bankName,
    });

    // Update bank account number 
    await db("config").where("code", "bank_account_no").update({
      value: bankAccountNo,
    });

    // Update bank account holder
    await db("config").where("code", "bank_account_holder").update({
      value: bankAccountHolder,
    });

    // Add new fields to the database updates
    await db("config").where("code", "waze_url").update({
      value: wazeUrl,
    });

    await db("config").where("code", "google_maps_url").update({
      value: googleMapsUrl,
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Organization details updated successfully",
    };
  } catch (error) {
    console.error("Error updating organization details:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update organization details",
    });
  }
}); 