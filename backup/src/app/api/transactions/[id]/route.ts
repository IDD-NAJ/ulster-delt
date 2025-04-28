import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const UpdateTransactionSchema = z.object({
  description: z.string().optional(),
  category: z.string().optional(),
  reference: z.string().optional(),
});

export const GET = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  })
);

export const PATCH = withErrorHandler(
  withAuth(
    withValidation(UpdateTransactionSchema, async (data, req, { params }) => {
      const session = await getServerSession();
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: params.id,
          userId: session?.user?.id,
        },
      });

      if (!transaction) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id: params.id },
        data,
      });

      return NextResponse.json(updatedTransaction);
    })
  )
);

export const DELETE = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Revert the account balance
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          [transaction.type === 'CREDIT' ? 'decrement' : 'increment']: transaction.amount,
        },
      },
    });

    await prisma.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  })
); 