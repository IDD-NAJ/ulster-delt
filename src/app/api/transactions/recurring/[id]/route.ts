import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const UpdateRecurringTransactionSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  category: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']).optional(),
});

export const GET = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const recurringTransaction = await prisma.recurringTransaction.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
      include: {
        account: true,
        category: true,
        transactions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!recurringTransaction) {
      return NextResponse.json(
        { error: 'Recurring transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recurringTransaction);
  })
);

export const PATCH = withErrorHandler(
  withAuth(
    withValidation(UpdateRecurringTransactionSchema, async (data, req, { params }) => {
      const session = await getServerSession();
      const recurringTransaction = await prisma.recurringTransaction.findFirst({
        where: {
          id: params.id,
          userId: session?.user?.id,
        },
      });

      if (!recurringTransaction) {
        return NextResponse.json(
          { error: 'Recurring transaction not found' },
          { status: 404 }
        );
      }

      const updatedTransaction = await prisma.recurringTransaction.update({
        where: { id: params.id },
        data: {
          ...data,
          // If status is changed to CANCELLED, set endDate to now
          ...(data.status === 'CANCELLED' && {
            endDate: new Date().toISOString()
          })
        },
        include: {
          account: true,
          category: true
        }
      });

      return NextResponse.json(updatedTransaction);
    })
  )
);

export const DELETE = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const recurringTransaction = await prisma.recurringTransaction.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
    });

    if (!recurringTransaction) {
      return NextResponse.json(
        { error: 'Recurring transaction not found' },
        { status: 404 }
      );
    }

    await prisma.recurringTransaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  })
); 