import { getConnection } from '../utils/db.js';
import { corsMiddleware } from '../utils/cors.js';

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id' });
      }

      let connection;
      try {
        connection = await getConnection();

        // Query to fetch all pending friend requests where the current user is the followee
        const [rows] = await connection.execute(
          `SELECT follower_user_id, updated_on 
            FROM follows 
            WHERE followee_user_id = ? AND status = 'accepted' 
            ORDER BY updated_on ASC`,
          [user_id]
        );

        if (rows.length === 0) {
          return res.status(200).json({ followers: [] }); // No followers
        }

        // Return the list of followers
        return res.status(200).json({ followers: rows });
      } catch (err) {
        console.error('Error fetching followers:', err);
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
