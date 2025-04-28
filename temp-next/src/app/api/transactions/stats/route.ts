import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler } from '@/lib/api-middleware';

const prisma = new PrismaClient();

export const GET = withErrorHandler(
  withAuth(async (req) => {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession();
    const startDate = searchParams.get('startDate') || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
    const endDate = searchParams.get('endDate') || new Date().toISOString();

    const [totalIncome, totalExpenses, categoryBreakdown, monthlyTrends] = await Promise.all([
      // Get total income
      prisma.transaction.aggregate({
        where: {
          userId: session?.user?.id,
          type: 'CREDIT',
          createdAt: { gte: new Date(startDate), lte: new Date(endDate) }
        },
        _sum: { amount: true }
      }),

      // Get total expenses
      prisma.transaction.aggregate({
        where: {
          userId: session?.user?.id,
          type: 'DEBIT',
          createdAt: { gte: new Date(startDate), lte: new Date(endDate) }
        },
        _sum: { amount: true }
      }),

      // Get spending by category
      prisma.transaction.groupBy({
        by: ['category'],
        where: {
          userId: session?.user?.id,
          createdAt: { gte: new Date(startDate), lte: new Date(endDate) }
        },
        _sum: { amount: true }
      }),

      // Get monthly trends
      prisma.transaction.groupBy({
        by: ['type', { dateField: 'createdAt', dateFormat: '%Y-%m' }],
        where: {
          userId: session?.user?.id,
          createdAt: { gte: new Date(startDate), lte: new Date(endDate) }
        },
        _sum: { amount: true }
      })
    ]);

    return NextResponse.json({
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      netChange: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
      categoryBreakdown: categoryBreakdown.map(cat => ({
        category: cat.category || 'Uncategorized',
        total: cat._sum.amount
      })),
      monthlyTrends: monthlyTrends.reduce((acc, trend) => {
        const month = trend.dateField;
        if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
        if (trend.type === 'CREDIT') {
          acc[month].income = trend._sum.amount || 0;
        } else {
          acc[month].expenses = trend._sum.amount || 0;
        }
        return acc;
      }, {})
    });
  })
); 