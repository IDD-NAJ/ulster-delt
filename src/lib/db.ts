import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// User operations
export async function createUser(data: {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
}) {
  return prisma.user.create({ data });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// Account operations
export async function createAccount(data: {
  type: string;
  userId: string;
  balance?: number;
}) {
  return prisma.account.create({ data });
}

export async function findAccountsByUserId(userId: string) {
  return prisma.account.findMany({ where: { userId } });
}

// Transaction operations
export async function createTransaction(data: {
  userId: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  categoryId?: string;
}) {
  return prisma.transaction.create({ data });
}

export async function findTransactionsByUserId(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    include: {
      account: true,
      category: true,
    },
  });
}

// Category operations
export async function createTransactionCategory(data: {
  userId: string;
  name: string;
  color?: string;
  icon?: string;
}) {
  return prisma.transactionCategory.create({ data });
}

export async function findCategoriesByUserId(userId: string) {
  return prisma.transactionCategory.findMany({ where: { userId } });
}

// Recurring Transaction operations
export async function createRecurringTransaction(data: {
  userId: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  categoryId?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: Date;
  endDate?: Date;
  nextDue: Date;
}) {
  return prisma.recurringTransaction.create({ data });
}

export async function findRecurringTransactionsByUserId(userId: string) {
  return prisma.recurringTransaction.findMany({
    where: { userId },
    include: {
      account: true,
      category: true,
    },
  });
}

// Transaction Template operations
export async function createTransactionTemplate(data: {
  userId: string;
  name: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  categoryId?: string;
  accountId: string;
  reference?: string;
}) {
  return prisma.transactionTemplate.create({ data });
}

export async function findTransactionTemplatesByUserId(userId: string) {
  return prisma.transactionTemplate.findMany({
    where: { userId },
    include: {
      account: true,
      category: true,
    },
  });
} 