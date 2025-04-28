import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const RecurringTransactionSchema = z.object({
  accountId: z.string(),
  type: z.enum(['DEBIT', 'CREDIT']),
  amount: z.number().positive(),
  currency: z.string(),
  description: z.string(),
  category: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  lastProcessed: z.string().datetime().optional(),
});

export const GET = withErrorHandler(
  withAuth(async (req) => {
    const session = await getServerSession();
    
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: { userId: session?.user?.id },
      include: {
        account: true,
        category: true,
      },
      orderBy: { nextDue: 'asc' }
    });

    return NextResponse.json(recurringTransactions);
  })
);

export const POST = withErrorHandler(
  withAuth(
    withValidation(RecurringTransactionSchema, async (data, req) => {
      const session = await getServerSession();

      // Calculate next due date based on frequency and start date
      const startDate = new Date(data.startDate);
      const nextDue = new Date(startDate);

      const recurringTransaction = await prisma.recurringTransaction.create({
        data: {
          ...data,
          userId: session?.user?.id!,
          nextDue,
          status: 'ACTIVE'
        },
        include: {
          account: true,
          category: true
        }
      });

      return NextResponse.json(recurringTransaction, { status: 201 });
    })
  )
); 