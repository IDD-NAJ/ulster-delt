import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Fetch monthly transactions
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate total spending and income
    const totalSpending = monthlyTransactions
      .filter(t => t.type === TransactionType.DEBIT)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = monthlyTransactions
      .filter(t => t.type === TransactionType.CREDIT)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate spending by category
    const spendingByCategory = monthlyTransactions
      .filter(t => t.type === TransactionType.DEBIT)
      .reduce((acc, t) => {
        const categoryName = t.category?.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Get spending trends (last 6 months)
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
    const monthlySpending = await prisma.transaction.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        type: TransactionType.DEBIT,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Get user's accounts and their balances
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        balance: true,
        accountNumber: true,
      },
    });

    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

    return NextResponse.json({
      totalSpending,
      totalIncome,
      savingsRate,
      spendingByCategory,
      monthlySpending,
      accounts,
      success: true,
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 