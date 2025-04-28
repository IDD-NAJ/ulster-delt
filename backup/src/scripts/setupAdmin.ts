import { createAdminUser } from '../services/adminAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.adminUser.findFirst();
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create initial admin user
    const adminData = {
      email: 'admin@ulsterdelt.com',
      name: 'System Admin',
      password: 'Lord471@1761' // This should be changed after first login
    };

    const admin = await createAdminUser(adminData);
    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      name: admin.name
    });
  } catch (error) {
    console.error('Error setting up admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin(); 