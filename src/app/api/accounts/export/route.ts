import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 100,
            },
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Create CSV header
    const csvHeader = 'Account Type,Account Number,Balance,Status,Last Transaction Date,Monthly Income,Monthly Spending\n';
    
    // Create CSV rows
    const csvRows = user.accounts.map(account => {
      const monthlyIncome = account.transactions
        .filter(tx => tx.type === 'CREDIT')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      const monthlySpending = account.transactions
        .filter(tx => tx.type === 'DEBIT')
        .reduce((sum, tx) => sum + tx.amount, 0);

      const lastTransaction = account.transactions[0]?.createdAt ?? account.updatedAt;

      return [
        account.type,
        account.accountNumber,
        account.balance.toFixed(2),
        account.status,
        new Date(lastTransaction).toLocaleDateString(),
        monthlyIncome.toFixed(2),
        monthlySpending.toFixed(2)
      ].join(',');
    }).join('\n');

    // Combine header and rows
    const csv = csvHeader + csvRows;

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=accounts_export.csv',
      },
    });
  } catch (error) {
    console.error('Error exporting accounts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 