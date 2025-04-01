import getConnection from '../utils/knex'

export default defineEventHandler(async (event) => {
  try {
    const knex = await getConnection()
    const users = await knex('users').select('*')
    return users
  } catch (error) {
    console.error('Error in users API:', error)
    throw createError({
      statusCode: 500,
      message: 'Database connection failed'
    })
  }
})
