import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const PORT = process.env.PORT || 3333;
const SSL_CERT =
    process.env.NODE_ENV === 'production'
      ? Buffer.from(process.env.SSL_CERT, 'utf-8')
      : fs.readFileSync('./singlestore_bundle.pem');

// Create a connection pool (adjust settings as needed)
const pool = mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: PORT,
  ssl: {
    ca: SSL_CERT,
  },
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue (adjust as needed)
});

// Export a function to get a connection from the pool
export const getConnection = async () => {
  return pool.getConnection();
};

// Optionally, export the pool for custom queries
export const poolQuery = async (query, params) => {
  const [results] = await pool.execute(query, params);
  return results;
};

export async function createConnection() {
  return mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: PORT,
    ssl: {
      ca: SSL_CERT,
    },
  });
}
