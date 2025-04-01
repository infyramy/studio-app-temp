import knex from '../../utils/knex'

export default defineEventHandler(async (event) => {
  try {
    const [
      chipMode,
      chipBrandId,
      chipSecretKey,
      enableChip,
      enableManual,
      enableFullPayment,
      enableDeposit,
      activePaymentMethods
    ] = await Promise.all([
      knex('config').where('code', 'chip_mode').select('value').first(),
      knex('config').where('code', 'chip_brand_id').select('value').first(),
      knex('config').where('code', 'chip_key').select('value').first(),
      knex('config').where('code', 'enable_chip').select('value').first(),
      knex('config').where('code', 'enable_manual').select('value').first(),
      knex('config').where('code', 'enable_full_payment').select('value').first(),
      knex('config').where('code', 'enable_deposit').select('value').first(),
      knex('config').where('code', 'chip_active_payment_methods').select('value').first(),
    ])

    return {
      statusCode: 200,
      data: {
        // CHIP settings
        chipMode: chipMode?.value || 'test',
        chipBrandId: chipBrandId?.value || '',
        chipSecretKey: chipSecretKey?.value || '',
        // Payment method settings
        enableChip: enableChip?.value,
        enableManual: enableManual?.value,
        // Payment amount settings
        enableFullPayment: enableFullPayment?.value,
        enableDeposit: enableDeposit?.value,
        // Active payment methods
        activePaymentMethods: activePaymentMethods?.value ? JSON.parse(activePaymentMethods.value) : [],
      },
    }
  } catch (error) {
    console.error('Error fetching payment config:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch payment configuration',
    })
  }
}) 