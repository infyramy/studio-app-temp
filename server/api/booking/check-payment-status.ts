import { H3Event } from 'h3'

const CHIP_SECRET_KEY = process.env.CHIP_SECRET_KEY

export default defineEventHandler(async (event: H3Event) => {
  try {
    const query = getQuery(event)
    const purchaseId = query.purchase_id

    if (!purchaseId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Purchase ID is required',
      })
    }

    // Call CHIP API to get payment status
    const response = await fetch(`https://gate.chip-in.asia/api/v1/purchases/${purchaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CHIP_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: data.message || 'Failed to check payment status',
      })
    }

    // Map CHIP status to our status
    const status = data.status === 'paid' ? 'completed' 
      : data.status === 'failed' ? 'failed'
      : data.status === 'cancelled' ? 'cancelled'
      : 'pending'

    return {
      status,
      chipStatus: data.status,
      purchase: data
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
}) 