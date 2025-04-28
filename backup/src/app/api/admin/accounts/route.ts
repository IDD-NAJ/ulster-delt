import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { userId, type, balance } = await req.json();
  if (!userId || !type || typeof balance !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const account = await prisma.account.create({
      data: {
        userId,
        type,
        balance,
        accountNumber: Math.random().toString().slice(2, 12),
        provider: 'local',
        providerAccountId: Math.random().toString(36).substring(2, 15),
      },
    });
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { accountId } = await req.json();
  if (!accountId) {
    return NextResponse.json({ error: 'Missing accountId' }, { status: 400 });
  }
  try {
    await prisma.account.delete({ where: { id: accountId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 