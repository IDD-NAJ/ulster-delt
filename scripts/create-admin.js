const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const adminPassword = 'Admin@123';
    const hashedPassword = await hash(adminPassword, 12);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ulsterdelt.com' },
      update: {},
      create: {
        email: 'admin@ulsterdelt.com',
        hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password:', adminPassword);
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 