import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { biller, amount, accountId, description } = await req.json();
    // TODO: Get user from session/auth (for now, assume accountId is provided)
    if (!biller || !amount || !accountId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Create a new transaction (debit from sender)
    const transaction = await prisma.transaction.create({
      data: {
        userId: '', // TODO: set from session
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