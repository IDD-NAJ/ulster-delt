import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';

function formatMonth(date: Date) {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function getMonthString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default async function StatementsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/accounts/statements');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      accounts: {
        include: {
          transactions: true,
        },
      },
    },
  });

  // Group transactions by account and month
  const statements: {
    accountName: string;
    accountNumber: string;
    month: string;
    totalIn: number;
    totalOut: number;
    count: number;
  }[] = [];

  user?.accounts.forEach(account => {
    const grouped: Record<string, { in: number; out: number; count: number }> = {};
    account.transactions.forEach(tx => {
      const month = formatMonth(tx.createdAt);
      if (!grouped[month]) grouped[month] = { in: 0, out: 0, count: 0 };
      if (tx.type === 'CREDIT') grouped[month].in += tx.amount;
      else grouped[month].out += tx.amount;
      grouped[month].count++;
    });
    Object.entries(grouped).forEach(([month, data]) => {
      statements.push({
        accountName: account.type,
        accountNumber: account.accountNumber,
        month,
        totalIn: data.in,
        totalOut: data.out,
        count: data.count,
      });
    });
  });

  // Add a helper to get the first transaction date for the month
  function getFirstTxDate(account: any, month: string) {
    const tx = account.transactions.find((t: any) => formatMonth(t.createdAt) === month);
    return tx ? tx.createdAt : null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-8">
      <div className="max-w-3xl w-full p-2 sm:p-8 bg-white rounded shadow">
        <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-[#1B4332]">Statements</h1>
        <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">View and download your account statements by month and account.</p>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 sm:px-4 py-2 text-left">Account</th>
                <th className="px-2 sm:px-4 py-2 text-left">Month</th>
                <th className="px-2 sm:px-4 py-2 text-left">Transactions</th>
                <th className="px-2 sm:px-4 py-2 text-left">Total In</th>
                <th className="px-2 sm:px-4 py-2 text-left">Total Out</th>
                <th className="px-2 sm:px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {statements.length ? statements.map((s, i) => {
                // Find the account and get the first transaction date for the month
                const account = user?.accounts.find(a => a.accountNumber === s.accountNumber);
                const firstTxDate = account ? getFirstTxDate(account, s.month) : null;
                const monthString = firstTxDate ? getMonthString(new Date(firstTxDate)) : '';
                const downloadUrl = `/api/statements/download?accountId=${encodeURIComponent(account?.id || '')}&month=${monthString}`;
                return (
                  <tr key={i} className="border-b">
                    <td className="px-2 sm:px-4 py-2">{s.accountName} (****{s.accountNumber.slice(-4)})</td>
                    <td className="px-2 sm:px-4 py-2">{s.month}</td>
                    <td className="px-2 sm:px-4 py-2">{s.count}</td>
                    <td className="px-2 sm:px-4 py-2">£{s.totalIn.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2">£{s.totalOut.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2 text-right">
                      <a href={downloadUrl} download>
                        <Button size="sm" variant="outline">Download</Button>
                      </a>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="px-2 sm:px-4 py-6 text-center text-muted-foreground">No statements found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <Link href="/accounts">
            <Button variant="outline">Back to Accounts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 