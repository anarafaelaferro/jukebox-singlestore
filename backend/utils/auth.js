import { verifyToken } from '@clerk/backend';
import axios from 'axios';

export async function requireAuth(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    return await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
}

export async function getAuthenticatedExternalId(req, res) {
  const payload = await requireAuth(req, res);
  if (!payload) {
    return null;
  }

  if (payload.external_id) {
    return String(payload.external_id);
  }

  try {
    const clerkResponse = await axios.get(`https://api.clerk.dev/v1/users/${payload.sub}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const externalId = clerkResponse.data.external_id;

    if (!externalId) {
      res.status(403).json({ error: 'User account not fully set up' });
      return null;
    }

    return String(externalId);
  } catch (err) {
    console.error('Error fetching authenticated user:', err);
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
}
