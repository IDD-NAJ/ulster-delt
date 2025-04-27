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
  const { type, amount, description } = await req.json();
  if (!accountId || !type || typeof amount !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const transaction = await prisma.transaction.create({
    data: {
      accountId,
      type,
      amount,
      description,
    },
  });
  return NextResponse.json(transaction, { status: 201 });
} 