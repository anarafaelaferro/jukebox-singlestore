import cors from 'cors';

export const corsMiddleware = cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export function withCors(handler) {
  return (req, res) => {
    corsMiddleware(req, res, async () => {
      try {
        await handler(req, res);
      } catch (error) {
        console.error(error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Server error' });
        }
      }
    });
  };
}
