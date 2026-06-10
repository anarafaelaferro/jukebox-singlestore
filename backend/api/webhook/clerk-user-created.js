import { getConnection } from '../../utils/db.js';
import cors from 'cors';
import axios from 'axios';

const corsMiddleware = cors();

export async function createUser(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'POST') {
      let connection;
      try {
        const { id: clerkUserId } = req.body.data;

        if (!clerkUserId) {
          res.status(400).json({ error: 'clerkUserId is required' });
          return;
        }

        // Connect to the database
        connection = await getConnection();

        // Insert user into the database
        await connection.execute(
          `INSERT INTO users (clerk_user_id) 
            VALUES (?) 
            ON DUPLICATE KEY UPDATE clerk_user_id = VALUES(clerk_user_id)`,
          [clerkUserId]
        );
        
        const [rows] = await connection.execute(
          `SELECT id FROM users WHERE clerk_user_id = ?`,
          [clerkUserId]
        );

        const singlestoreId = rows?.[0]?.id;
        
        // set externalId in clerk
        await axios.patch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
          external_id: String(singlestoreId),
        }, {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, // API key stored in environment variables
            'Content-Type': 'application/json',
          },
        });

        res.status(200).json({ message: 'User inserted/updated successfully' });
      } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Server error');
      } finally {
        if (connection) {
          connection.release();
        }
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
