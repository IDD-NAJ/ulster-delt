import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const SearchSchema = z.object({
  query: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categories: z.array(z.string()).optional(),
  accounts: z.array(z.string()).optional(),
  types: z.array(z.enum(['DEBIT', 'CREDIT'])).optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  status: z.array(z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'])).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
  sortBy: z.enum(['date', 'amount', 'description']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const POST = withErrorHandler(
  withAuth(
    withValidation(SearchSchema, async (data, req) => {
      const session = await getServerSession();
      const {
        query,
        startDate,
        endDate,
        categories,
        accounts,
        types,
        minAmount,
        maxAmount,
        status,
        page,
        limit,
        sortBy,
        sortOrder
      } = data;

      const where = {
        userId: session?.user?.id,
        ...(query && {
          OR: [
            { description: { contains: query, mode: 'insensitive' } },
            { reference: { contains: query, mode: 'insensitive' } }
          ]
        }),
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
        }),
        ...(types?.length && {
          type: { in: types }
        }),
        ...(status?.length && {
          status: { in: status }
        }),
        ...((minAmount !== undefined || maxAmount !== undefined) && {
          amount: {
            ...(minAmount !== undefined && { gte: minAmount }),
            ...(maxAmount !== undefined && { lte: maxAmount })
          }
        })
      };

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: {
            account: true,
            category: true
          },
          orderBy: {
            ...(sortBy === 'date' && { createdAt: sortOrder }),
            ...(sortBy === 'amount' && { amount: sortOrder }),
            ...(sortBy === 'description' && { description: sortOrder })
          },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.transaction.count({ where })
      ]);

      // Calculate totals for filtered transactions
      const totals = await prisma.transaction.groupBy({
        by: ['type'],
        where,
        _sum: {
          amount: true
        }
      });

      const totalDebits = totals.find(t => t.type === 'DEBIT')?._sum.amount || 0;
      const totalCredits = totals.find(t => t.type === 'CREDIT')?._sum.amount || 0;

      return NextResponse.json({
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        summary: {
          totalDebits,
          totalCredits,
          netAmount: totalCredits - totalDebits
        }
      });
    })
  )
); 