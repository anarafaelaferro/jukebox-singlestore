export async function getRelationshipRows(connection, userIdA, userIdB) {
  const [rows] = await connection.execute(
    `SELECT follower_user_id, followee_user_id, status, created_on
     FROM follows
     WHERE (follower_user_id = ? AND followee_user_id = ?)
        OR (follower_user_id = ? AND followee_user_id = ?)`,
    [userIdA, userIdB, userIdB, userIdA]
  );

  return rows;
}

export function parseFollowStatus(rows) {
  if (rows.length === 0) {
    return { status: 'none', initiator_user_id: null };
  }

  const pending = rows.find((row) => row.status === 'pending');
  if (pending) {
    return {
      status: 'pending',
      initiator_user_id: String(pending.follower_user_id),
    };
  }

  if (rows.some((row) => row.status === 'accepted')) {
    return { status: 'accepted', initiator_user_id: null };
  }

  return {
    status: rows[0].status,
    initiator_user_id: String(rows[0].follower_user_id),
  };
}

export function validateNewFriendRequestFromRows(rows, followerUserId, followeeUserId) {
  if (String(followerUserId) === String(followeeUserId)) {
    return { error: 'Cannot send friend request to yourself.', status: 400 };
  }

  for (const row of rows) {
    if (row.status === 'accepted') {
      return { error: 'You are already friends with this user.', status: 409 };
    }

    if (row.status === 'pending') {
      if (String(row.follower_user_id) === String(followerUserId)) {
        return { error: 'Friend request already sent.', status: 409 };
      }

      return { error: 'This user has already sent you a friend request.', status: 409 };
    }
  }

  return null;
}
