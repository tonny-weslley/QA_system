export const websocketConfig = {
  port: parseInt(process.env.WS_PORT || '3001', 10),
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
};
