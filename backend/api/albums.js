import { createConnection } from '../utils/db.js';
import cors from 'cors';

const corsMiddleware = cors();

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      let connection;
      try {
        connection = await createConnection();
        const [rows] = await connection.execute('SELECT * FROM album_calendar ORDER BY calendar_date ASC');
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
