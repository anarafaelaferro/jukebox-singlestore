import mysql from 'mysql2/promise';
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
  return await mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: PORT,
    ssl: {
      ca: Buffer.from(process.env.SSL_CERT, 'utf-8'),
    },
  });
}

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      let connection;
      try {
        console.log('Creating connection');
        connection = await createConnection();
        console.log('Connection created');
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
