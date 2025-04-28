import { AdminLayout } from '@/components/admin/AdminLayout';
import { prisma } from '@/lib/prisma';
import UserTableClient from './UserTableClient';

export default async function UsersPage() {
  // Fetch users from the database, including account count, balance, and type
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      accounts: {
        select: {
          id: true,
          balance: true,
          type: true,
          accountNumber: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Map users to include accountsCount, total balance, and accounts array
  const userData = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: 'Active', // Placeholder, you can add real status if available
    lastLogin: '-',   // Placeholder, add real lastLogin if available
    accountsCount: u.accounts.length,
    balance: u.accounts.reduce((sum, acc) => sum + acc.balance, 0),
    accounts: u.accounts.map(acc => ({
      id: acc.id,
      balance: acc.balance,
      type: acc.type,
      accountNumber: acc.accountNumber,
    })),
  }));

  return (
    <AdminLayout>
      <UserTableClient users={userData} />
    </AdminLayout>
  );
} 