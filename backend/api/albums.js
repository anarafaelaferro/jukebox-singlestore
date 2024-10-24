import mysql from 'mysql2/promise';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const PORT = process.env.PORT || 3333;

const corsMiddleware = cors(); // Create CORS middleware

async function createConnection() {
  const SSL_CERT = await fs.readFileSync(process.cwd() + '/backend/singlestore_bundle.pem', 'utf8');

  return await mysql.createConnection({
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

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      let connection;
      try {
        connection = await createConnection();
        const [rows] = await connection.execute('SELECT * FROM album_calendar'); // Example query
        res.status(200).json(rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      } finally {
        if (connection) {
          await connection.end();
        }
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
