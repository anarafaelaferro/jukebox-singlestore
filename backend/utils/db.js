import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const PORT = process.env.PORT || 3333;

export async function createConnection() {
  const SSL_CERT =
    process.env.NODE_ENV === 'production'
      ? Buffer.from(process.env.SSL_CERT, 'utf-8')
      : fs.readFileSync('./singlestore_bundle.pem');

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
