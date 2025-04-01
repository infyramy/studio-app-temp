export const dbConfig = {
  host: process.env.DB_HOST || '218.208.91.135',
  user: process.env.DB_USER || 'stitchshutter_app',
  password: process.env.DB_PASSWORD || '84Dtlm1={1;M',
  database: process.env.DB_NAME || 'stitchshutter_app',
  port: Number(process.env.DB_PORT) || 3306
} 