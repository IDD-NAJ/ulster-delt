import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { accountSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-error";
import { authOptions } from "../auth/[...nextauth]/route";
import { formatAccountNumber } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10,
              select: {
                id: true,
                type: true,
                amount: true,
                description: true,
                createdAt: true,
                status: true,
                category: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Transform the data to match the expected format
    const accounts = user.accounts.map(account => ({
      id: account.id,
      type: account.type,
      name: `${account.type.charAt(0)}${account.type.slice(1).toLowerCase()} Account`,
      accountNumber: formatAccountNumber(account.accountNumber),
      balance: account.balance,
      currency: 'GBP',
      status: 'active',
      lastTransaction: account.transactions[0]?.createdAt ?? account.updatedAt,
      transactions: account.transactions.map(tx => ({
        id: tx.id,
        type: tx.type.toLowerCase(),
        amount: tx.amount,
        description: tx.description,
        date: tx.createdAt,
        category: tx.category?.name || 'Uncategorized'
      })),
      monthlySpending: account.transactions
        .filter(tx => tx.type === 'DEBIT')
        .reduce((sum, tx) => sum + tx.amount, 0),
      monthlyIncome: account.transactions
        .filter(tx => tx.type === 'CREDIT')
        .reduce((sum, tx) => sum + tx.amount, 0)
    }));

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = accountSchema.parse(body);

    const account = await prisma.account.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
} 