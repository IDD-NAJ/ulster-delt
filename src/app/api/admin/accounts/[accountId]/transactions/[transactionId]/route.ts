import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { accountId: string, transactionId: string } }) {
  const { transactionId } = params;
  const { type, amount, description } = await req.json();
  if (!transactionId || !type || typeof amount !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { type, amount, description },
  });
  return NextResponse.json(transaction);
} 