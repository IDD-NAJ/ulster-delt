import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, type, description, accountId, currency } = body;

    if (!userId || !amount || !type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!['CREDIT', 'DEBIT'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }
    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Find the account
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    if (account.userId !== userId) {
      return NextResponse.json({ error: 'Account does not belong to user' }, { status: 403 });
    }

    // Calculate new balance
    let newBalance = account.balance;
    if (type === 'CREDIT') {
      newBalance += Number(amount);
    } else {
      newBalance -= Number(amount);
      if (newBalance < 0) {
        return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
      }
    }

    // Create transaction and update account in a transaction
    const transaction = await prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          userId,
          accountId,
          type,
          amount: Number(amount),
          currency: currency || account.currency || 'GBP',
          description,
          status: 'COMPLETED',
        },
      });
      await tx.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      });
      return created;
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating transaction' }, { status: 500 });
  }
} 