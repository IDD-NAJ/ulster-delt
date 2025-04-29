import { PrismaClient, CardType, CardStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a test user if none exists
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      hashedPassword: await hash('password123', 12),
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      role: 'USER',
    },
  });

  // Create a test account if none exists
  const testAccount = await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'credentials',
        providerAccountId: 'test-account',
      },
    },
    update: {},
    create: {
      type: 'SAVINGS',
      balance: 1000,
      provider: 'credentials',
      providerAccountId: 'test-account',
      userId: testUser.id,
    },
  });

  // Create a test card if none exists
  const existingCard = await prisma.card.findFirst({
    where: { userId: testUser.id },
  });

  if (!existingCard) {
    await prisma.card.create({
      data: {
        userId: testUser.id,
        accountId: testAccount.id,
        cardNumber: '4532123456789012',
        cvv: '123',
        expiryDate: new Date(2025, 11), // December 2025
        type: CardType.DEBIT,
        status: CardStatus.ACTIVE,
        dailyLimit: 1000,
        monthlyLimit: 10000,
        isVirtual: false,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 