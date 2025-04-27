import { PrismaClient } from '@prisma/client';
import type { AdminUser as PrismaAdminUser } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

export class AdminUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaAdminUser) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.password = data.hashedPassword;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAdminUserByEmail(email: string) {
    try {
      if (!prisma) {
        throw new Error('Database connection not initialized');
      }
      
      const admin = await prisma.adminUser.findUnique({
        where: { email }
      });
      return admin ? new AdminUser(admin) : null;
    } catch (error) {
      console.error('Error finding admin by email:', error);
      throw error;
    }
  }

  static async createAdminUser(data: {
    email: string;
    name: string;
    password: string;
    role?: string;
  }) {
    try {
      if (!prisma) {
        throw new Error('Database connection not initialized');
      }

      const admin = await prisma.adminUser.create({
        data: {
          email: data.email,
          name: data.name,
          hashedPassword: data.password,
          role: data.role || 'ADMIN'
        }
      });
      return new AdminUser(admin);
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  static async getAdminUserById(id: string) {
    try {
      if (!prisma) {
        throw new Error('Database connection not initialized');
      }

      const admin = await prisma.adminUser.findUnique({
        where: { id }
      });
      return admin ? new AdminUser(admin) : null;
    } catch (error) {
      console.error('Error finding admin by id:', error);
      throw error;
    }
  }

  static async updateAdminUser(id: string, data: {
    email?: string;
    name?: string;
    password?: string;
    role?: string;
  }) {
    try {
      if (!prisma) {
        throw new Error('Database connection not initialized');
      }

      const admin = await prisma.adminUser.update({
        where: { id },
        data: {
          ...data,
          ...(data.password && { hashedPassword: data.password })
        }
      });
      return new AdminUser(admin);
    } catch (error) {
      console.error('Error updating admin user:', error);
      throw error;
    }
  }

  static async deleteAdminUser(id: string) {
    try {
      if (!prisma) {
        throw new Error('Database connection not initialized');
      }

      await prisma.adminUser.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting admin user:', error);
      throw error;
    }
  }
}

export const getAllAdminUsers = async () => {
  try {
    if (!prisma) {
      throw new Error('Database connection not initialized');
    }

    const admins = await prisma.adminUser.findMany();
    return admins.map(admin => new AdminUser(admin));
  } catch (error) {
    console.error('Error getting all admin users:', error);
    throw error;
  }
}; 
 