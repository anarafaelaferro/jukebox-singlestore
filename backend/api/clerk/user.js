import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { withCors } from '../../utils/cors.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id parameter' });
  }

  try {
    const clerkResponse = await axios.get(`https://api.clerk.dev/v1/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(camelcaseKeys(clerkResponse.data)); // Forward the Clerk API response to the client
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
}

export default withCors(handler);
