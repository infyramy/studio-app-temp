import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const [companyName, companyEmail, ssmNumber, logoUrl, wazeUrl, googleMapsUrl, bankQrCode, bankName, bankAccountNo, bankAccountHolder, companyAddress] = await Promise.all([
      db("config").where("code", "company_name").first(),
      db("config").where("code", "company_email").first(),
      db("config").where("code", "ssm_number").first(),
      db("config").where("code", "logo_url").first(),
      db("config").where("code", "waze_url").first(),
      db("config").where("code", "google_maps_url").first(),
      db("config").where("code", "bank_qrcode").first(),
      db("config").where("code", "bank_name").first(),
      db("config").where("code", "bank_account_no").first(),
      db("config").where("code", "bank_account_holder").first(),
      db("config").where("code", "company_address").first(),
    ]);

    return {
      statusCode: 200,
      data: {
        companyName: companyName?.value || "",
        companyEmail: companyEmail?.value || "",
        ssmNumber: ssmNumber?.value || "",
        logoUrl: logoUrl?.value || "",
        wazeUrl: wazeUrl?.value || "",
        googleMapsUrl: googleMapsUrl?.value || "",
        bankQrCode: bankQrCode?.value || "",
        bankName: bankName?.value || "",
        bankAccountNo: bankAccountNo?.value || "",
        bankAccountHolder: bankAccountHolder?.value || "",
        companyAddress: companyAddress?.value || "",
      },
    };
  } catch (error) {
    console.error("Error fetching organization details:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch organization details",
    });
  }
}); 