import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create initial admin user
    const adminData = {
      email: 'admin@ulsterdelt.com',
      firstName: 'System',
      lastName: 'Admin',
      hashedPassword: await bcrypt.hash('Admin@123456', 10),
      dateOfBirth: '1990-01-01',
      phoneNumber: '+1234567890',
      role: UserRole.ADMIN
    };

    const admin = await prisma.user.create({
      data: adminData
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      name: `${admin.firstName} ${admin.lastName}`
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 