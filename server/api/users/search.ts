import knex from '../../utils/knex'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const { search, role, page = 1, limit = 10 } = query
    const offset = (Number(page) - 1) * Number(limit)

    // Build query with Knex
    const usersQuery = knex('user')
      .select('user.*')
      .modify((queryBuilder) => {
        // Add search condition if provided
        if (search) {
          queryBuilder.where((builder) => {
            builder
              .where('name', 'like', `%${search}%`)
              .orWhere('email', 'like', `%${search}%`)
          })
        }

        // Add role filter if provided
        if (role) {
          queryBuilder.where('role', role)
        }
      })

    // Get total count for pagination
    const [{ total }] = await knex('user')
      .count('* as total')
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder.where((builder) => {
            builder
              .where('name', 'like', `%${search}%`)
              .orWhere('email', 'like', `%${search}%`)
          })
        }
        if (role) {
          queryBuilder.where('role', role)
        }
      })

    // Get paginated results
    const users = await usersQuery
      .orderBy('created_at', 'desc')
      .limit(Number(limit))
      .offset(offset)

    return {
      users,
      pagination: {
        total: Number(total),
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(Number(total) / Number(limit))
      }
    }
  } catch (error) {
    console.error('Error searching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error'
    })
  }
}) 