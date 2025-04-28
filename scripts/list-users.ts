import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users with their accounts
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
      },
    });

    console.log('Users in database:');
    console.log('----------------');
    
    users.forEach(user => {
      console.log(`\nUser ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Role: ${user.role}`);
      console.log('Accounts:');
      user.accounts.forEach(account => {
        console.log(`  - Type: ${account.type}`);
        console.log(`    Balance: ${account.balance}`);
        console.log(`    Account ID: ${account.id}`);
      });
      console.log('----------------');
    });

  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 