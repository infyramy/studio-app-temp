import { H3Event } from 'h3'
import { sendWhatsAppNotification } from "../../utils/whatsapp"
import { createCalendarEvent } from "../../utils/calendar"

interface BookingData {
  date: string
  time: string
  theme: number
  number_of_pax: number
  add_ons: Array<{
    id: number
    quantity: number
  }>
  name: string
  email: string
  phone: string
  source: string
  payment_type: number
  payment_amount: number
  chip_purchase_id: string
}

function generateReceiptNumber() {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `RCP${timestamp}${random}`
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<BookingData>(event)

    // Generate receipt number
    const receiptNumber = generateReceiptNumber()

    // Check if the theme is valid
    const themeData = await knex("theme").where("id", body.theme).first()
    if (!themeData) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid theme",
      })
    }

    // Get configuration values
    const [chargePerPax, maxFreePax] = await Promise.all([
      knex("config").select("value").where("code", "charge_per_pax").first(),
      knex("config").select("value").where("code", "max_free_pax").first(),
    ])

    // Calculate extra pax charges
    let paymentExtraPax = 0
    if (body.number_of_pax > parseInt(maxFreePax.value)) {
      paymentExtraPax = (body.number_of_pax - parseInt(maxFreePax.value)) * parseInt(chargePerPax.value)
    }

    // Process add-ons
    let addons = []
    let paymentAddon = 0
    if (body.add_ons?.length > 0) {
      for (const addon of body.add_ons) {
        const addonData = await knex("addon").where("id", addon.id).first()
        if (!addonData) {
          throw createError({
            statusCode: 400,
            statusMessage: "Invalid add-on",
          })
        }
        addons.push({
          id: addonData.id,
          qty: addon.quantity,
          price: addonData.price,
        })
        paymentAddon += addonData.price * addon.quantity
      }
    }

    // Calculate total payment
    const paymentTotal = themeData.price + paymentAddon + paymentExtraPax

    // Create the booking
    const [bookingId] = await knex("booking").insert({
      user_fullname: body.name,
      user_email: body.email,
      user_phoneno: body.phone,
      user_source: body.source,
      session_date: body.date,
      session_time: body.time,
      theme: body.theme,
      number_of_pax: body.number_of_pax,
      number_of_extra_pax: body.number_of_pax > parseInt(maxFreePax.value)
        ? body.number_of_pax - parseInt(maxFreePax.value)
        : 0,
      addon: addons.length > 0 ? JSON.stringify(addons) : null,
      frame_status: addons.length > 0 ? 1 : 0,
      payment_ref_number: receiptNumber,
      payment_type: body.payment_type,
      payment_method: 1, // FPX via CHIP
      payment_amount: body.payment_amount,
      payment_addon_total: paymentAddon,
      payment_total: paymentTotal,
      payment_extra_pax: paymentExtraPax,
      chip_purchase_id: body.chip_purchase_id,
      status: body.payment_type === 1 ? 3 : 2, // 3 = Paid, 2 = Deposit Paid
      session_status: 1, // Pending
      created_date: new Date(),
    })

    // Get the created booking
    const booking = await knex("booking")
      .select("*")
      .where("id", bookingId)
      .first()

    // Send WhatsApp notification
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER
    if (adminPhoneNumber) {
      await sendWhatsAppNotification(adminPhoneNumber, booking)
    }

    // Create calendar event
    const calendarResult = await createCalendarEvent(booking)
    if (!calendarResult.success) {
      console.error("Failed to create calendar event:", calendarResult.error)
    }

    return {
      status: "success",
      message: "Booking created successfully",
      data: {
        booking_id: bookingId,
        receipt_number: receiptNumber
      }
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal server error",
    })
  }
}) 