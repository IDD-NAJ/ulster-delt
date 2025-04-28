const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.account.create({
  data: {
    type: 'SAVINGS',
    accountNumber: 'DUMMY123456',
    balance: 1000,
    userId: 'REPLACE_WITH_VALID_USER_ID',
    currency: 'GBP',
  }
}).then(console.log).catch(console.error);