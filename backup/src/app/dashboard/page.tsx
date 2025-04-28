import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AccountSummary from '@/components/dashboard/AccountSummary';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import CardSlider from '@/components/dashboard/CardSlider';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Notifications } from '@/components/dashboard/Notifications';
import type { Prisma } from '@prisma/client';

type ExtendedAccount = Prisma.AccountGetPayload<{
  include: {
    transactions: true;
  };
}> & {
  accountNumber: string;
};

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      redirect('/login?callbackUrl=/dashboard');
    }

    // Fetch user's account information with more comprehensive data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            }
          }
        },
        cards: {
          select: {
            id: true,
            type: true,
            lastFourDigits: true,
            isActive: true,
            expiryMonth: true,
            expiryYear: true,
          }
        },
        notificationPreferences: true,
      },
    });

    if (!user) {
      redirect('/login');
    }

    // Get recent transactions for each account with enhanced data
    const accountsWithTransactions: ExtendedAccount[] = user.accounts.map(account => ({
      ...account,
      transactions: account.transactions,
      accountNumber: account.accountNumber || '****'
    }));

    // Get all transactions for the RecentTransactions component
    const allTransactions = accountsWithTransactions.flatMap(account => account.transactions);

    // Get all active cards
    const activeCards = user.cards.filter(card => card.isActive);

    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Welcome back, {user.firstName}!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Suspense fallback={<LoadingSpinner />}>
                <AccountSummary 
                  accounts={accountsWithTransactions}
                />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner />}>
                <RecentTransactions 
                  transactions={allTransactions}
                />
              </Suspense>
            </div>
            
            <div className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <CardSlider cards={activeCards} />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                <QuickActions />
              </Suspense>
            </div>
          </div>

          <Notifications />
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>There was an error loading your dashboard. Please try again later.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
} 