import { getConnection } from '../utils/db.js';
import { getAuthenticatedExternalId } from '../utils/auth.js';
import { getRelationshipRows } from '../utils/follows.js';
import { corsMiddleware } from '../utils/cors.js';

function isParticipant(authenticatedUserId, followerUserId, followeeUserId) {
  return (
    authenticatedUserId === String(followerUserId) ||
    authenticatedUserId === String(followeeUserId)
  );
}

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'POST') {
      let connection;

      try {
        const authenticatedUserId = await getAuthenticatedExternalId(req, res);
        if (!authenticatedUserId) {
          return;
        }

        const { follower_user_id, followee_user_id, action } = req.body;

        if (
          !follower_user_id ||
          !followee_user_id ||
          !['accept', 'reject', 'cancel'].includes(action)
        ) {
          return res.status(400).json({
            error:
              'follower_user_id, followee_user_id, and a valid action (accept/reject/cancel) are required.',
          });
        }

        if (!isParticipant(authenticatedUserId, follower_user_id, followee_user_id)) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        connection = await getConnection();

        const rows = await getRelationshipRows(
          connection,
          follower_user_id,
          followee_user_id
        );
        const pendingRow = rows.find((row) => row.status === 'pending');
        const isFriend = rows.some((row) => row.status === 'accepted');

        if (action === 'cancel') {
          if (String(follower_user_id) !== authenticatedUserId) {
            return res.status(403).json({ error: 'Forbidden' });
          }

          if (!pendingRow || String(pendingRow.follower_user_id) !== authenticatedUserId) {
            return res.status(404).json({ error: 'Friend request not found.' });
          }

          const deleteQuery = `DELETE FROM follows
            WHERE follower_user_id = ? AND followee_user_id = ? AND status = 'pending'`;
          await connection.execute(deleteQuery, [follower_user_id, followee_user_id]);

          return res.status(200).json({ message: 'Friend request canceled successfully.' });
        }

        if (action === 'reject') {
          if (pendingRow) {
            if (String(followee_user_id) !== authenticatedUserId) {
              return res.status(403).json({ error: 'Forbidden' });
            }
          } else if (!isFriend) {
            return res.status(404).json({ error: 'Relationship not found.' });
          }

          const deleteQuery = `DELETE FROM follows
            WHERE (follower_user_id = ? AND followee_user_id = ?)
               OR (follower_user_id = ? AND followee_user_id = ?)`;
          await connection.execute(deleteQuery, [
            follower_user_id,
            followee_user_id,
            followee_user_id,
            follower_user_id,
          ]);

          return res.status(200).json({ message: 'Friend request rejected successfully.' });
        }

        if (action === 'accept') {
          if (String(followee_user_id) !== authenticatedUserId) {
            return res.status(403).json({ error: 'Forbidden' });
          }

          const acceptQuery = `
            UPDATE follows
            SET status = 'accepted', updated_on = NOW()
            WHERE follower_user_id = ? AND followee_user_id = ? AND status = 'pending';
          `;
          const [result] = await connection.execute(acceptQuery, [
            follower_user_id,
            followee_user_id,
          ]);

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Friend request not found or already processed.' });
          }

          const reciprocalInsertQuery = `
            INSERT INTO follows (follower_user_id, followee_user_id, status, created_on, updated_on)
            VALUES (?, ?, 'accepted', NOW(), NOW())
            ON DUPLICATE KEY UPDATE status = 'accepted', updated_on = NOW();
          `;
          await connection.execute(reciprocalInsertQuery, [
            followee_user_id,
            follower_user_id,
          ]);

          return res.status(200).json({ message: 'Friend request accepted successfully.' });
        }
      } catch (err) {
        console.error('Error handling follow request action:', err);
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
