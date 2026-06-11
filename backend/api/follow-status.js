import { getConnection } from '../utils/db.js';
import {
  getRelationshipRows,
  parseFollowStatus,
} from '../utils/follows.js';
import { corsMiddleware } from '../utils/cors.js';

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      const { follower_user_id, followee_user_id } = req.query;

      if (!follower_user_id || !followee_user_id) {
        return res.status(400).json({ error: 'Missing follower_user_id or followee_user_id' });
      }

      let connection;

      try {
        connection = await getConnection();

        const rows = await getRelationshipRows(
          connection,
          follower_user_id,
          followee_user_id
        );

        return res.status(200).json(parseFollowStatus(rows));
      } catch (err) {
        console.error('Error fetching follow status:', err);
        res.status(500).send('Server error');
      } finally {
        if (connection) {
          connection.release();
        }
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
