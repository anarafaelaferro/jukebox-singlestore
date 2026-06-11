import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { withCors } from '../../utils/cors.js';

const clerkHeaders = {
  Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
  'Content-Type': 'application/json',
};

function extractUsers(clerkResponse) {
  const payload = clerkResponse.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

async function fetchUsersByExternalId(externalId) {
  const clerkResponse = await axios.get('https://api.clerk.dev/v1/users', {
    params: {
      external_id: externalId,
      limit: 1,
    },
    headers: clerkHeaders,
  });

  return extractUsers(clerkResponse);
}

async function fetchUsersByUsername(username) {
  const normalizedUsername = String(username).trim().toLowerCase();

  // Clerk expects username as an array for exact matches
  const exactResponse = await axios.get('https://api.clerk.dev/v1/users', {
    params: {
      username: [username],
      limit: 10,
    },
    headers: clerkHeaders,
  });

  let users = extractUsers(exactResponse).filter(
    (user) => user.username?.toLowerCase() === normalizedUsername
  );

  if (users.length > 0) {
    return users;
  }

  // Fallback: partial username search, then keep exact route match
  const queryResponse = await axios.get('https://api.clerk.dev/v1/users', {
    params: {
      username_query: username,
      limit: 10,
    },
    headers: clerkHeaders,
  });

  users = extractUsers(queryResponse).filter(
    (user) => user.username?.toLowerCase() === normalizedUsername
  );

  if (users.length > 0) {
    return users;
  }

  const broadResponse = await axios.get('https://api.clerk.dev/v1/users', {
    params: {
      query: username,
      limit: 10,
    },
    headers: clerkHeaders,
  });

  return extractUsers(broadResponse).filter(
    (user) => user.username?.toLowerCase() === normalizedUsername
  );
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { external_ids, external_id, username } = req.query;

  try {
    const batchIds = external_ids || (external_id?.includes(',') ? external_id : null);

    if (batchIds) {
      const ids = String(batchIds)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      const users = [];

      for (const id of ids) {
        const matches = await fetchUsersByExternalId(id);
        users.push(...matches);
      }

      return res.status(200).json(camelcaseKeys(users, { deep: true }));
    }

    if (username) {
      const users = await fetchUsersByUsername(username);
      return res.status(200).json(camelcaseKeys(users, { deep: true }));
    }

    if (external_id) {
      const users = await fetchUsersByExternalId(external_id);
      return res.status(200).json(camelcaseKeys(users, { deep: true }));
    }

    const clerkResponse = await axios.get('https://api.clerk.dev/v1/users', {
      params: {
        limit: 100,
        offset: 0,
        order_by: '-created_at',
      },
      headers: clerkHeaders,
    });

    res.status(200).json(camelcaseKeys(extractUsers(clerkResponse), { deep: true }));
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
}

export default withCors(handler);
