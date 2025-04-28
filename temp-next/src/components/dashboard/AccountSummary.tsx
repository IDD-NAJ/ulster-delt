'use client';

import { Account, Transaction } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { formatCurrency, cn } from '@/lib/utils';
import { Eye, EyeOff, Wallet, CreditCard, Briefcase, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ExtendedAccount extends Account {
  transactions: Transaction[];
  accountNumber: string;
}

interface AccountSummaryProps {
  accounts?: ExtendedAccount[];
  isLoading?: boolean;
  error?: Error | null;
}

const accountTypeIcons: Record<string, any> = {
  CHECKING: Wallet,
  SAVINGS: Briefcase,
  CREDIT_CARD: CreditCard,
};

const accountTypeColors: Record<string, { bg: string; text: string }> = {
  CHECKING: { bg: 'bg-blue-100', text: 'text-blue-700' },
  SAVINGS: { bg: 'bg-green-100', text: 'text-green-700' },
  CREDIT_CARD: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

function formatAccountNumber(accountNumber: string | null | undefined) {
  if (!accountNumber) return '****';
  const last4 = accountNumber.replace(/[^0-9]/g, '').slice(-4);
  if (last4.length < 4) return '****';
  return `****${last4}`;
}

function getTransactionTrend(transactions: Transaction[]) {
  if (transactions.length < 2) return 'neutral';
  const latest = transactions[0]?.amount || 0;
  const previous = transactions[1]?.amount || 0;
  return latest >= previous ? 'up' : 'down';
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default function AccountSummary({ accounts = [], isLoading = false, error = null }: AccountSummaryProps) {
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const [sortBy, setSortBy] = useState<'type' | 'balance'>('type');
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Failed to load accounts: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  const sortedAccounts = [...accounts].sort((a, b) => {
    if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return b.balance - a.balance;
  });

  return (
    <section className="w-full max-w-5xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4">
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 sm:gap-3">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold tracking-tight">
            Account Summary
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'type' | 'balance')}
              className="text-xs sm:text-sm bg-transparent border rounded-md py-1 px-2 focus:ring-2 
                       focus:ring-primary/20 outline-none"
            >
              <option value="type">Sort by Type</option>
              <option value="balance">Sort by Balance</option>
            </select>
            <button
              onClick={() => setShowAccountNumbers(!showAccountNumbers)}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-700 
                       transition-colors duration-200 w-fit hover:bg-gray-50 rounded-md py-1 px-2
                       focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {showAccountNumbers ? (
                <>
                  <EyeOff className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="whitespace-nowrap">Hide Account Numbers</span>
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="whitespace-nowrap">Show Account Numbers</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid gap-2 xs:gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
        <TooltipProvider>
          <Card className="p-3 sm:p-4 md:p-5 col-span-1 sm:col-span-2 lg:col-span-3 
                         bg-gradient-to-br from-primary/5 to-primary/10
                         hover:from-primary/10 hover:to-primary/15 
                         transition-all duration-300 border-primary/20">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-48" />
              </div>
            ) : (
              <>
                <h3 className="text-sm xs:text-base sm:text-lg font-medium mb-1 sm:mb-1.5 text-primary">
                  Total Balance
                </h3>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary break-words">
                  {formatCurrency(totalBalance)}
                </p>
              </>
            )}
          </Card>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-2 xs:p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </Card>
            ))
          ) : (
            sortedAccounts.map((account) => {
              const Icon = accountTypeIcons[account.type] || Wallet;
              const colors = accountTypeColors[account.type] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              const trend = getTransactionTrend(account.transactions);
              const lastTransaction = account.transactions[0];
              
              return (
                <Tooltip key={account.id}>
                  <TooltipTrigger asChild>
                    <Card 
                      className="p-2 xs:p-3 sm:p-4 hover:shadow-lg transition-all duration-300 
                               hover:scale-[1.02] hover:bg-gray-50/50 cursor-help
                               border-t-4 relative overflow-hidden group"
                      style={{ borderTopColor: colors.text.replace('text', 'rgb').replace('-', '') }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/30 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="flex flex-col space-y-1 xs:space-y-1.5 sm:space-y-2">
                          <div className="flex flex-col xs:flex-row justify-between items-start gap-1 xs:gap-1.5">
                            <div className="flex items-center gap-2 order-2 xs:order-1">
                              <div className={cn("p-1.5 rounded-full", colors.bg)}>
                                <Icon className={cn("h-4 w-4", colors.text)} />
                              </div>
                              <div>
                                <h3 className="text-sm xs:text-base font-medium">
                                  {account.type}
                                </h3>
                                <p className="text-[10px] xs:text-xs text-gray-500">
                                  {account.type.charAt(0) + account.type.slice(1).toLowerCase().replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="order-1 xs:order-2 font-mono text-[10px] xs:text-xs"
                            >
                              {showAccountNumbers 
                                ? account.accountNumber 
                                : formatAccountNumber(account.accountNumber)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-lg xs:text-xl font-semibold break-words">
                                {formatCurrency(account.balance)}
                              </p>
                              <p className="text-[10px] xs:text-xs text-gray-500">
                                Available Balance
                              </p>
                            </div>
                            {trend !== 'neutral' && (
                              <div className={cn(
                                "flex items-center gap-1 text-xs",
                                trend === 'up' ? 'text-green-600' : 'text-red-600'
                              )}>
                                {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              </div>
                            )}
                          </div>

                          {lastTransaction && (
                            <div className="flex items-center gap-1.5 text-[10px] xs:text-xs text-gray-500 mt-2 pt-2 border-t">
                              <Clock size={12} />
                              <span>Last transaction: {formatDate(lastTransaction.createdAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent className="p-3 space-y-2 max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium">Account Details</p>
                      <p className="text-xs text-gray-500">Type: {account.type}</p>
                      <p className="text-xs text-gray-500">Status: Active</p>
                    </div>
                    {lastTransaction && (
                      <div className="space-y-1">
                        <p className="font-medium">Last Transaction</p>
                        <p className="text-xs text-gray-500">{lastTransaction.description}</p>
                        <p className="text-xs text-gray-500">
                          Amount: {formatCurrency(lastTransaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Date: {formatDate(lastTransaction.createdAt)}
                        </p>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })
          )}
        </TooltipProvider>
      </div>
    </section>
  );
} 