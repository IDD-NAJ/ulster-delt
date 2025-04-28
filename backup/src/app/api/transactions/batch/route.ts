import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const BatchOperationSchema = z.object({
  operation: z.enum(['UPDATE', 'DELETE']),
  transactionIds: z.array(z.string()),
  data: z.object({
    category: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
  }).optional(),
});

export const POST = withErrorHandler(
  withAuth(
    withValidation(BatchOperationSchema, async (data, req) => {
      const session = await getServerSession();
      const { operation, transactionIds, data: updateData } = data;

      // Verify ownership of all transactions
      const transactions = await prisma.transaction.findMany({
        where: {
          id: { in: transactionIds },
          userId: session?.user?.id,
        },
      });

      if (transactions.length !== transactionIds.length) {
        return NextResponse.json(
          { error: 'One or more transactions not found or unauthorized' },
          { status: 404 }
        );
      }

      let results;

      if (operation === 'UPDATE' && updateData) {
        results = await prisma.transaction.updateMany({
          where: {
            id: { in: transactionIds },
            userId: session?.user?.id,
          },
          data: updateData,
        });
      } else if (operation === 'DELETE') {
        // For each transaction, revert the account balance before deleting
        await Promise.all(
          transactions.map(async (transaction) => {
            await prisma.account.update({
              where: { id: transaction.accountId },
              data: {
                balance: {
                  [transaction.type === 'CREDIT' ? 'decrement' : 'increment']: transaction.amount,
                },
              },
            });
          })
        );

        results = await prisma.transaction.deleteMany({
          where: {
            id: { in: transactionIds },
            userId: session?.user?.id,
          },
        });
      }

      return NextResponse.json({
        success: true,
        operation,
        affected: results?.count || 0,
      });
    })
  )
); 