import { H3Event } from 'h3'
import knex from '~/server/utils/knex'

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

    // Validate required fields
    if (!amount || !bookingId || !customerEmail || !customerName || !phone) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields',
      })
    }

    // Validate amount is positive
    if (amount <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid payment amount',
      })
    }

    // Check for existing payment
    const existingPayment = await knex('booking')
      .where('id', bookingId)
      .select('status', 'chip_purchase_id')
      .first()

    if (!existingPayment) {
      throw createError({
        statusCode: 404,
        message: 'Booking not found',
      })
    }

    // Prevent duplicate payment attempts
    if (existingPayment.chip_purchase_id) {
      throw createError({
        statusCode: 400,
        message: 'Payment already initialized for this booking',
      })
    }

    // Check if booking is already paid
    if (existingPayment.status === 3) {
      throw createError({
        statusCode: 400,
        message: 'Booking is already paid',
      })
    }

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

    // Update booking with CHIP purchase ID
    await knex('booking')
      .where('id', bookingId)
      .update({ 
        chip_purchase_id: data.id,
        payment_initiated_at: new Date().toISOString()
      })

    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal server error',
    })
  }
}) 