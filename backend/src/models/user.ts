import bcrypt from 'bcrypt';
import { User } from './db';

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export class UserModel {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static sanitize(user: User) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
