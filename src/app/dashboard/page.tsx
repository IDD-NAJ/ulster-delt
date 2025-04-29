import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AccountSummary from '@/components/dashboard/AccountSummary';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Notifications } from '@/components/dashboard/Notifications';
import { type Account, type Transaction } from '@prisma/client';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: {
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
              category: {
                select: {
                  name: true,
                  color: true,
                  icon: true,
                }
              }
            }
          }
        }
      },
      cards: true,
      notificationPreferences: true,
    },
  });

  if (!user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Get accounts with transactions
  const accountsWithTransactions = user.accounts.map(account => ({
    ...account,
    transactions: account.transactions.map(tx => ({
      ...tx,
      category: tx.category || {
        name: 'Uncategorized',
        color: '#808080',
        icon: '📊'
      }
    }))
  }));

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back, {user.firstName}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<LoadingSpinner />}>
              <AccountSummary accounts={accountsWithTransactions} />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner />}>
              <RecentTransactions 
                transactions={accountsWithTransactions.flatMap(account => account.transactions)}
              />
            </Suspense>
          </div>
          
          <div className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <QuickActions />
            </Suspense>
          </div>
        </div>

        <Notifications />
      </div>
    </DashboardLayout>
  );
} 