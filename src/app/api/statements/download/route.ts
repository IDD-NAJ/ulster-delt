import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function toCSV(rows: any[]) {
  if (!rows.length) return '';
  const header = Object.keys(rows[0]).join(',');
  const body = rows.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  return `${header}\n${body}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get('accountId');
  const month = searchParams.get('month'); // format: YYYY-MM
  if (!accountId || !month) {
    return NextResponse.json({ error: 'Missing accountId or month' }, { status: 400 });
  }
  const [year, m] = month.split('-').map(Number);
  if (!year || !m) {
    return NextResponse.json({ error: 'Invalid month format' }, { status: 400 });
  }
  const from = new Date(year, m - 1, 1);
  const to = new Date(year, m, 1);
  const transactions = await prisma.transaction.findMany({
    where: {
      accountId,
      createdAt: {
        gte: from,
        lt: to,
      },
    },
    orderBy: { createdAt: 'asc' },
  });
  const csv = toCSV(transactions.map(tx => ({
    Date: tx.createdAt.toISOString().slice(0, 10),
    Type: tx.type,
    Amount: tx.amount,
    Currency: tx.currency,
    Description: tx.description,
    Status: tx.status,
    Reference: tx.reference || '',
  })));
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="statement-${accountId}-${month}.csv"`,
    },
  });
} 