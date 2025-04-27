const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function generateAccountNumber() {
  // Generate a random 10-digit account number
  return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
}

async function main() {
  try {
    // Get all accounts
    const accounts = await prisma.account.findMany();

    console.log(`Found ${accounts.length} accounts to process`);

    // Set account numbers for each account
    for (const account of accounts) {
      let accountNumber;
      let isUnique = false;

      // Keep generating account numbers until we find a unique one
      while (!isUnique) {
        accountNumber = generateAccountNumber();
        const existing = await prisma.account.findFirst({
          where: { 
            AND: [
              { accountNumber },
              { NOT: { id: account.id } }
            ]
          },
        });
        if (!existing) {
          isUnique = true;
        }
      }

      await prisma.account.update({
        where: { id: account.id },
        data: { accountNumber },
      });
      console.log(`Set account number ${accountNumber} for account ${account.id}`);
    }

    console.log('Successfully set account numbers');
  } catch (error) {
    console.error('Error setting account numbers:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 