export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-here-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
