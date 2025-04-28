import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user
    const hashedPassword = await hash('test123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        phoneNumber: '1234567890',
        role: 'USER',
      },
    });

    // Create a test account for the user
    const account = await prisma.account.create({
      data: {
        type: 'CHECKING',
        balance: 1000.00,
        userId: user.id,
        provider: 'TEST_BANK',
        providerAccountId: 'TEST_ACC_001',
      },
    });

    console.log('Test user created:', {
      id: user.id,
      email: user.email,
      accountId: account.id,
    });
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 