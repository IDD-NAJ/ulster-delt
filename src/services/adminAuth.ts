import { AdminUser } from '../models/AdminUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AdminAuthService {
  static async login(email: string, password: string) {
    const admin = await AdminUser.getAdminUserByEmail(email);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }

  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export async function createAdminUser(data: {
  email: string;
  name: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return AdminUser.createAdminUser({
    ...data,
    password: hashedPassword
  });
} 