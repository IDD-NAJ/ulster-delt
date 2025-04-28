import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const ExportSchema = z.object({
  format: z.enum(['CSV', 'JSON']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categories: z.array(z.string()).optional(),
  accounts: z.array(z.string()).optional(),
});

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function generateCSV(transactions: any[]): string {
  const headers = [
    'Date',
    'Description',
    'Amount',
    'Currency',
    'Type',
    'Category',
    'Account',
    'Reference',
    'Status'
  ].join(',');

  const rows = transactions.map(t => [
    formatDate(t.createdAt),
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount,
    t.currency,
    t.type,
    t.category?.name || '',
    t.account.name,
    t.reference || '',
    t.status
  ].join(','));

  return [headers, ...rows].join('\n');
}

export const POST = withErrorHandler(
  withAuth(
    withValidation(ExportSchema, async (data, req) => {
      const session = await getServerSession();
      const { format, startDate, endDate, categories, accounts } = data;

      const where = {
        userId: session?.user?.id,
        ...(startDate && endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }),
        ...(categories?.length && {
          categoryId: { in: categories }
        }),
        ...(accounts?.length && {
          accountId: { in: accounts }
        })
      };

      const transactions = await prisma.transaction.findMany({
        where,
        include: {
          account: true,
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });

      if (format === 'CSV') {
        const csv = generateCSV(transactions);
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="transactions-${formatDate(new Date())}.csv"`
          }
        });
      }

      return NextResponse.json({
        transactions,
        exportDate: new Date().toISOString(),
        totalRecords: transactions.length
      });
    })
  )
); 