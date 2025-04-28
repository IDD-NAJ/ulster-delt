import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AccountSummary from '@/components/dashboard/AccountSummary';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Notifications } from '@/components/dashboard/Notifications';
import { type Account, type Transaction } from '@prisma/client';

export default async function DashboardPage() {
  console.log('Starting dashboard page load');
  
  const session = await getServerSession(authOptions);
  console.log('Session:', session ? 'Found' : 'Not found');

  if (!session?.user?.email) {
    console.log('No session or email, redirecting to login');
    redirect('/login?callbackUrl=/dashboard');
  }

  try {
    console.log('Fetching user data for email:', session.user.email);
    // Fetch user's account information with more comprehensive data
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

    console.log('User data:', user ? 'Found' : 'Not found');

    if (!user) {
      console.log('User not found in database, redirecting to login');
      redirect('/login');
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

    console.log('Rendering dashboard with accounts:', accountsWithTransactions.length);

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
  } catch (error) {
    console.error('Dashboard error:', error);
    // Only handle actual errors, not redirects
    if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
      return (
        <DashboardLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p>There was an error loading your dashboard. Please try again later.</p>
              <p className="mt-2 text-sm">Error details: {error.message}</p>
            </div>
          </div>
        </DashboardLayout>
      );
    }
    // Re-throw redirect errors
    throw error;
  }
} 