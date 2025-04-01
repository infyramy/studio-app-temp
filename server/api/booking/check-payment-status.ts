import { H3Event } from 'h3'

const CHIP_SECRET_KEY = process.env.CHIP_SECRET_KEY
const CACHE_DURATION = 30000 // 30 seconds cache
const statusCache = new Map<string, { status: string; timestamp: number }>()

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

    // Check cache first
    const cachedStatus = statusCache.get(purchaseId as string)
    if (cachedStatus && Date.now() - cachedStatus.timestamp < CACHE_DURATION) {
      return {
        status: cachedStatus.status,
        chipStatus: cachedStatus.status,
        cached: true
      }
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

    // Update cache
    statusCache.set(purchaseId as string, {
      status,
      timestamp: Date.now()
    })

    return {
      status,
      chipStatus: data.status,
      cached: false
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
}) 