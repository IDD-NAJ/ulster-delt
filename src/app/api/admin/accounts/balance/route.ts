import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const { accountId, balance, type } = await req.json();
  if (!accountId || typeof balance !== 'number') {
    return NextResponse.json({ error: 'Missing accountId or balance' }, { status: 400 });
  }
  const data: any = { balance };
  if (type) data.type = type;
  const account = await prisma.account.update({
    where: { id: accountId },
    data,
  });
  await fetchTransactions(accountId);
  return NextResponse.json(account);
}

async function fetchTransactions(accountId) {
  const res = await fetch(`/api/admin/accounts/${accountId}/transactions`);
  if (res.ok) {
    // Handle the response as needed
  }
} 