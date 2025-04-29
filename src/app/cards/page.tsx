import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CardsList } from '@/components/cards/CardsList';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default async function CardsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/cards');
  }

  // Get user's default account
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: {
        take: 1,
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!user) {
    redirect('/login?callbackUrl=/cards');
  }

  const defaultAccountId = user.accounts[0]?.id;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <CardsList accountId={defaultAccountId} />
      </div>
    </DashboardLayout>
  );
} 