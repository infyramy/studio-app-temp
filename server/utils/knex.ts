import knex, { Knex } from "knex";
import { dbConfig } from "./db.config";

// Timeout wrapper for promises
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 50000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
    ),
  ]);
}

// Optimize connection settings for serverless environment
const knexConfig = {
  client: "mysql2",
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    connectTimeout: 10000,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 2, // Keep at least 2 connections ready
    max: 20, // Reduced from 50 to prevent overwhelming the database
    acquireTimeoutMillis: 30000, // Increased timeout for better reliability
    createTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 2000,
    propagateCreateError: false, // Don't throw errors on connection creation
  },
  acquireConnectionTimeout: 30000,
  afterCreate: (conn: any, done: Function) => {
    // Set session variables for better performance
    conn.query('SET SESSION wait_timeout=28800;', (err: Error) => {
      if (err) {
        console.error('Error setting session timeout:', err);
      }
      done(err, conn);
    });
  },
};

// Create knex instance with connection handling
let knexInstance: Knex | null = null;

function getKnex(): Knex {
  if (!knexInstance) {
    knexInstance = knex(knexConfig);

    // Add error handling
    knexInstance.on("error", (err: any) => {
      console.error("Database connection error:", {
        message: err.message,
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
      });

      // Destroy the instance on fatal errors
      if (err.fatal) {
        knexInstance?.destroy(() => {
          knexInstance = null;
        });
      }
    });
  }
  return knexInstance as Knex;
}

// Initialize and export the Knex instance
const db = getKnex();

// Test the connection on first import
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((err) => {
    console.error('Failed to establish database connection:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
    });
  });

export default db;
