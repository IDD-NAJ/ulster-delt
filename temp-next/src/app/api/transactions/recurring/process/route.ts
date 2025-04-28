import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler } from '@/lib/api-middleware';

const prisma = new PrismaClient();

function calculateNextDueDate(frequency: string, currentDate: Date): Date {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case 'DAILY':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'WEEKLY':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'MONTHLY':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'YEARLY':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
}

export const POST = withErrorHandler(
  withAuth(async (req) => {
    const session = await getServerSession();
    const now = new Date();

    // Get all active recurring transactions that are due
    const dueTransactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: session?.user?.id,
        status: 'ACTIVE',
        nextDue: {
          lte: now
        },
        OR: [
          { endDate: null },
          { endDate: { gt: now } }
        ]
      },
      include: {
        account: true
      }
    });

    const results = await Promise.all(
      dueTransactions.map(async (recurring) => {
        // Create the transaction
        const transaction = await prisma.transaction.create({
          data: {
            userId: recurring.userId,
            accountId: recurring.accountId,
            type: recurring.type,
            amount: recurring.amount,
            currency: recurring.currency,
            description: recurring.description,
            categoryId: recurring.categoryId,
            status: 'COMPLETED',
            recurringTransactionId: recurring.id
          }
        });

        // Update account balance
        await prisma.account.update({
          where: { id: recurring.accountId },
          data: {
            balance: {
              [recurring.type === 'CREDIT' ? 'increment' : 'decrement']: recurring.amount
            }
          }
        });

        // Update recurring transaction
        const nextDue = calculateNextDueDate(recurring.frequency, now);
        await prisma.recurringTransaction.update({
          where: { id: recurring.id },
          data: {
            lastProcessed: now,
            nextDue
          }
        });

        return transaction;
      })
    );

    return NextResponse.json({
      processed: results.length,
      transactions: results
    });
  })
); 