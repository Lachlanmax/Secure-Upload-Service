import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthToken } from '../types/index';

const users: Map<string, User> = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export class AuthService {
  static async registerUser(email: string, password: string): Promise<User> {
    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);
    const user: User = {
      id: uuidv4(),
      email,
      passwordHash,
      createdAt: new Date(),
    };

    users.set(user.id, user);
    return user;
  }

  static async loginUser(email: string, password: string): Promise<{ user: User; token: AuthToken }> {
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    return {
      user,
      token: {
        token,
        expiresIn: 86400,
      },
    };
  }

  static verifyToken(token: string): { userId: string; email: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static getUserById(userId: string): User | undefined {
    return users.get(userId);
  }
}
