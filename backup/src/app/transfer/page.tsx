import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransferForm from '@/components/transfer/TransferForm';
import RecentTransfers from '@/components/transfer/RecentTransfers';
import { Card } from '@/components/ui/card';

export default async function TransferPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/transfer');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      accounts: true,
      transactions: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        where: {
          type: 'CREDIT' // Only get transfer transactions
        }
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Transfer Money</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <TransferForm accounts={user.accounts} />
            </Card>
          </div>

          <div>
            <RecentTransfers transfers={user.transactions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 