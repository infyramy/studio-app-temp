import { H3Event } from "h3";
import knex from "../../utils/knex";

interface PaymentConfig {
  // CHIP settings
  chipMode: string;
  chipBrandId: string;
  chipSecretKey: string;
  // Payment method settings
  enableChip: boolean;
  enableManual: boolean;
  // Payment amount settings
  enableFullPayment: boolean;
  enableDeposit: boolean;
  // Active payment methods
  activePaymentMethods: string[];
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<PaymentConfig>(event);
    const {
      chipMode,
      chipBrandId,
      chipSecretKey,
      enableChip,
      enableManual,
      enableFullPayment,
      enableDeposit,
      activePaymentMethods,
    } = body;

    console.log("Body", body);

    // Update payment method settings
    await knex("config")
      .where("code", "enable_chip")
      .update({ value: enableChip ? 1 : 0 })
      .onConflict("code")
      .merge();

    await knex("config")
      .where("code", "enable_manual")
      .update({ value: enableManual ? 1 : 0 })
      .onConflict("code")
      .merge();

    // Update payment amount settings
    await knex("config")
      .where("code", "enable_full_payment")
      .update({ value: enableFullPayment ? 1 : 0 })
      .onConflict("code")
      .merge();

    await knex("config")
      .where("code", "enable_deposit")
      .update({ value: enableDeposit ? 1 : 0 })
      .onConflict("code")
      .merge();

    // Update CHIP settings if CHIP is enabled
    if (enableChip) {
      // Update CHIP mode
      await knex("config")
        .where("code", "chip_mode")
        .update({ value: chipMode })
        .onConflict("code")
        .merge();

      // Update CHIP brand ID
      await knex("config")
        .where("code", "chip_brand_id")
        .update({ value: chipBrandId })
        .onConflict("code")
        .merge();

      // Update CHIP secret key
      await knex("config")
        .where("code", "chip_key")
        .update({ value: chipSecretKey })
        .onConflict("code")
        .merge();

      // Update active payment methods
      await knex("config")
        .where("code", "chip_active_payment_methods")
        .update({ value: JSON.stringify(activePaymentMethods) })
        .onConflict("code")
        .merge();
    }

    return {
      statusCode: 200,
      message: "Payment settings updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating payment settings:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal server error",
    });
  }
});
