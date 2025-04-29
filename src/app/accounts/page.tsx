import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, Wallet, PiggyBank } from "lucide-react";
import Link from "next/link";
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import QuickActions from '@/components/accounts/QuickActions';
import AccountCard from '@/components/accounts/AccountCard';

export default async function AccountsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/accounts');
  }

  // Fetch user's accounts with transactions
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      accounts: {
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              createdAt: true,
              amount: true,
              type: true,
            }
          }
        }
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Back to Dashboard */}
        <div className="flex items-center space-x-2 sm:space-x-4 mb-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332]">Accounts Overview</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your accounts and banking services</p>
        </div>

        {/* Quick Actions */}
        <QuickActions accounts={user.accounts.map(acc => ({ id: acc.id, type: acc.type, accountNumber: acc.accountNumber }))} />

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            {user.accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </Suspense>

          {/* Add Account Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] space-y-4">
              <div className="p-4 rounded-full bg-accent">
                <PlusCircle className="h-6 w-6 text-[#1B4332]" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-base sm:text-lg text-[#1B4332]">Open New Account</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Choose from our range of accounts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 sm:p-6 flex items-start space-x-2 sm:space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg">Current Account</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Everyday banking with great benefits</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 sm:p-6 flex items-start space-x-2 sm:space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg">Savings Account</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Earn interest on your savings</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 