import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List users with pagination
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        accounts: { select: { id: true, balance: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  const userData = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: 'Active',
    lastLogin: '-',
    accountsCount: u.accounts.length,
    balance: u.accounts.reduce((sum, acc) => sum + acc.balance, 0),
  }));

  return NextResponse.json({ users: userData, total });
}

// POST: Create user
export async function POST(req: NextRequest) {
  const { name, email, role, hashedPassword, firstName, lastName, dateOfBirth } = await req.json();
  if (!name || !email || !role || !hashedPassword || !firstName || !lastName || !dateOfBirth) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try {
    const user = await prisma.user.create({
      data: { name, email, role, hashedPassword, firstName, lastName, dateOfBirth },
    });
    return NextResponse.json(user);
  } catch (err: any) {
    console.error('Failed to create user:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update user
export async function PUT(req: NextRequest) {
  const { id, name, email, role, status } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  const user = await prisma.user.update({
    where: { id },
    data: { name, email, role, status },
  });
  return NextResponse.json(user);
}

// DELETE: Delete user
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  // Delete related transactions first
  await prisma.transaction.deleteMany({ where: { userId: id } });

  // Now delete the user
  await prisma.user.delete({ where: { id } });

  // Do NOT use useRouter or router.push in an API route
  return NextResponse.json({ success: true });
} 