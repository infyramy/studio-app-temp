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
    connectTimeout: 10000, // Reduced to 10 seconds for faster failure
    ssl: {
      rejectUnauthorized: false, // Add this if your DB uses SSL
    },
  },
  pool: {
    min: 0, // Important for serverless: start with 0 connections
    max: 50, // Reduced pool size for serverless
    acquireTimeoutMillis: 15000, // Reduced timeout
    createTimeoutMillis: 15000,
    idleTimeoutMillis: 15000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 2000,
  },
  acquireConnectionTimeout: 15000,
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
