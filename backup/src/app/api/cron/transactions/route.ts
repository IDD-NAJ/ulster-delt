import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Vercel Cron Job - runs daily at midnight
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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

export async function GET(req: Request) {
  const headersList = headers();
  const authHeader = headersList.get('authorization');
  
  // Verify cron secret
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  try {
    // Get all active recurring transactions that are due
    const dueTransactions = await prisma.recurringTransaction.findMany({
      where: {
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
        try {
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

          return { success: true, transaction };
        } catch (error) {
          console.error(`Error processing recurring transaction ${recurring.id}:`, error);
          return { success: false, error, recurringId: recurring.id };
        }
      })
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      processed: results.length,
      successful,
      failed,
      results
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 