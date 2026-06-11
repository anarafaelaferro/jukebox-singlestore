import { getConnection } from '../utils/db.js';
import { getAuthenticatedExternalId } from '../utils/auth.js';
import {
  getRelationshipRows,
  validateNewFriendRequestFromRows,
} from '../utils/follows.js';
import { corsMiddleware } from '../utils/cors.js';

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'POST') {
      let connection;

      try {
        const authenticatedUserId = await getAuthenticatedExternalId(req, res);
        if (!authenticatedUserId) {
          return;
        }

        const { follower_user_id, followee_user_id } = req.body;

        if (!follower_user_id || !followee_user_id) {
          return res.status(400).json({
            error: 'follower_user_id and followee_user_id are required.',
          });
        }

        if (String(follower_user_id) !== authenticatedUserId) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        connection = await getConnection();

        const existingRows = await getRelationshipRows(
          connection,
          follower_user_id,
          followee_user_id
        );

        const validationError = validateNewFriendRequestFromRows(
          existingRows,
          follower_user_id,
          followee_user_id
        );

        if (validationError) {
          return res.status(validationError.status).json({ error: validationError.error });
        }

        const query = `
          INSERT INTO follows (follower_user_id, followee_user_id, status, created_on, updated_on)
          VALUES (?, ?, 'pending', NOW(), NOW())
        `;
        await connection.execute(query, [follower_user_id, followee_user_id]);

        res.status(200).json({ message: 'Friend request sent successfully.' });
      } catch (err) {
        console.error('Error handling follow request:', err);
        res.status(500).json({ error: 'Server error' });
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
