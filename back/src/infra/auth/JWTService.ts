import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt';

export interface JWTPayload {
  userId: string;
  username: string;
  role: 'admin' | 'participant';
}

export class JWTService {
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: '24h',
    });
  }

  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
