import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function StandingOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/accounts/standing-orders');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      recurringTransactions: {
        orderBy: { nextDue: 'asc' },
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-8">
      <div className="max-w-2xl w-full p-2 sm:p-8 bg-white rounded shadow">
        <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-[#1B4332]">Standing Orders</h1>
        <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">View and manage your standing orders below.</p>
        <div className="mb-4 sm:mb-6 flex justify-end">
          <Button variant="default" disabled /* TODO: open modal */>New Standing Order</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 sm:px-4 py-2 text-left">Payee</th>
                <th className="px-2 sm:px-4 py-2 text-left">Amount</th>
                <th className="px-2 sm:px-4 py-2 text-left">Frequency</th>
                <th className="px-2 sm:px-4 py-2 text-left">Next Due</th>
                <th className="px-2 sm:px-4 py-2 text-left">Status</th>
                <th className="px-2 sm:px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {user?.recurringTransactions.length ? user.recurringTransactions.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="px-2 sm:px-4 py-2">{order.description}</td>
                  <td className="px-2 sm:px-4 py-2">£{order.amount.toFixed(2)}</td>
                  <td className="px-2 sm:px-4 py-2">{order.frequency}</td>
                  <td className="px-2 sm:px-4 py-2">{order.nextDue.toLocaleDateString()}</td>
                  <td className="px-2 sm:px-4 py-2">{order.status}</td>
                  <td className="px-2 sm:px-4 py-2 text-right">
                    <Button size="sm" variant="outline" disabled /* TODO: cancel/edit */>Cancel</Button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-2 sm:px-4 py-6 text-center text-muted-foreground">No standing orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 sm:mt-8">
          <Link href="/accounts">
            <Button variant="outline">Back to Accounts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 