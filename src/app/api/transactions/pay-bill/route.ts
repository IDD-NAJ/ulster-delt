import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.status === 'Frozen') {
      return NextResponse.json({ error: 'Account is frozen' }, { status: 403 });
    }
    const { biller, amount, accountId, description } = await req.json();
    if (!biller || !amount || !accountId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Create a new transaction (debit from sender)
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId,
        type: 'DEBIT',
        amount: parseFloat(amount),
        currency: 'GBP',
        description: description || `Pay bill to ${biller}`,
        status: 'COMPLETED',
      },
    });
    // Optionally: update account balance, etc.
    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 