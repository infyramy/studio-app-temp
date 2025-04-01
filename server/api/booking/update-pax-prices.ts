import { defineEventHandler, readBody } from 'h3'
import db from '~/server/utils/knex'
import { PaxBasedPrice } from '~/types/dashboard'

export default defineEventHandler(async (event) => {
  try {
    const themeId = event.context.params?.id
    if (!themeId) {
      throw createError({
        statusCode: 400,
        message: 'Theme ID is required'
      })
    }

    const body = await readBody(event)
    const { pax_prices } = body

    // Delete existing pax prices
    await db('theme_pax_prices')
      .where('theme_id', themeId)
      .delete()

    // Insert new pax prices
    if (pax_prices && pax_prices.length > 0) {
      const pricesData = pax_prices.map((price: PaxBasedPrice) => ({
        ...price,
        theme_id: themeId
      }))
      await db('theme_pax_prices').insert(pricesData)
    }

    return {
      message: 'Pax prices updated successfully'
    }
  } catch (error) {
    console.error('Error updating pax prices:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update pax prices'
    })
  }
}) 