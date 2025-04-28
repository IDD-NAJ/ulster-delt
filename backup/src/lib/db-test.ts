import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        hashedPassword: 'test123',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
      },
    });
    console.log('Test user created:', testUser);

    // Clean up the test user
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log('Test user deleted');

    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 