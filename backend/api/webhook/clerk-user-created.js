import pkg from '@clerk/nextjs/server';
const { WebhookEvent } = pkg;
import { createConnection } from '../../utils/db.js';
import cors from 'cors';

const corsMiddleware = cors();
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'POST') {
      let connection;
      try {
        const payload = req.body;
        const signature = req.headers['clerk-signature'];

        // Verify the webhook payload
        const verifiedPayload = WebhookEvent.verify({ payload, secret: WEBHOOK_SECRET, signature });
        const { id: clerkUserId } = verifiedPayload;

        // Connect to the database
        connection = await createConnection();

        // Insert or update user in the database
        await connection.execute(
          'INSERT INTO users (clerk_user_id) VALUES (?) ON DUPLICATE KEY UPDATE clerk_user_id = VALUES(clerk_user_id)',
          [clerkUserId]
        );

        res.status(200).send('User saved successfully');
      } catch (err) {
        console.error('Error handling webhook:', err);
        res.status(500).send('Server error');
      } finally {
        if (connection) {
          await connection.end();
        }
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
