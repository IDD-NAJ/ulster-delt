import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { accountId: string } }) {
  const { accountId } = params;
  if (!accountId) {
    return NextResponse.json([], { status: 200 });
  }
  const transactions = await prisma.transaction.findMany({
    where: { accountId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest, { params }: { params: { accountId: string } }) {
  const { accountId } = params;
  const { type, amount, description, currency, date } = await req.json();
  if (!accountId || !type || typeof amount !== 'number' || !currency) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { userId: true }
  });
  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }
  const transaction = await prisma.transaction.create({
    data: {
      accountId,
      userId: account.userId,
      type,
      amount,
      description,
      currency,
      createdAt: date ? new Date(date) : undefined,
    },
  });
  return NextResponse.json(transaction, { status: 201 });
} 