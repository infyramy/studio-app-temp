import mysql from 'mysql2/promise'
import { dbConfig } from './db.config'

// Create a connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Helper function to execute queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Export the pool for direct access if needed
export default pool 