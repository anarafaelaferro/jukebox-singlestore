import { createUser } from './webhook/clerk-user-created.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Read the request body
      const body = req.body;

      // If the webhook sender sends raw body (not JSON), parse it manually
      // const body = JSON.parse(req.body);

      console.log('Webhook event received:', body);

      if(body.type === "user.created") {
        createUser(req, res);
      }
    } catch (err) {
      console.error('Error processing webhook:', err);
      res.status(400).json({ status: 'error', message: 'Invalid webhook payload' });
    }
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
