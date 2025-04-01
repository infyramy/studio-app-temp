import { H3Event } from 'h3'

const CHIP_SECRET_KEY = process.env.CHIP_SECRET_KEY
const CHIP_BRAND_ID = process.env.CHIP_BRAND_ID

interface PaymentRequest {
  amount: number
  bookingId: string
  customerEmail: string
  customerName: string
  phone: string
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<PaymentRequest>(event)
    const { amount, bookingId, customerEmail, customerName, phone } = body

    // Create payment with CHIP API
    const response = await fetch('https://gate.chip-in.asia/api/v1/purchases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHIP_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brand_id: CHIP_BRAND_ID,
        reference: bookingId,
        platform: 'web',
        purchase: {
          amount: amount * 100, // Convert to cents
          currency: 'MYR',
          due: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        },
        client: {
          email: customerEmail,
          full_name: customerName,
          phone: phone,
        },
        success_callback: `${process.env.PUBLIC_API_URL}/api/booking/payment-callback`,
        success_redirect: `${process.env.PUBLIC_URL}/book-a-session/receipt?booking_id=${bookingId}`,
        failure_redirect: `${process.env.PUBLIC_URL}/book-a-session/receipt?booking_id=${bookingId}&status=failed`,
        cancel_redirect: `${process.env.PUBLIC_URL}/book-a-session/receipt?booking_id=${bookingId}&status=cancelled`,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: data.message || 'Failed to create payment',
      })
    }

    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
}) 