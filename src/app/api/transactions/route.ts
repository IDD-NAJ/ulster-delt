import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { transactionSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-error";
import { authOptions } from "../auth/[...nextauth]/route";

const TransactionSchema = z.object({
  type: z.enum(['CREDIT', 'DEBIT']),
  amount: z.number().positive(),
  currency: z.string(),
  description: z.string().min(1),
  accountId: z.string(),
  categoryId: z.string().optional(),
  date: z.string(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { description: { contains: search, mode: "insensitive" } },
          { category: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { date, description, amount, type, categoryId, currency } = body;

    if (!date || !description || !amount || !type || !categoryId || !currency) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount,
        type,
        categoryId,
        currency,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing transaction ID", { status: 400 });
    }

    const body = await request.json();
    const { date, description, amount, type, categoryId, currency } = body;

    const transaction = await prisma.transaction.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        date: new Date(date),
        description,
        amount,
        type,
        categoryId,
        currency,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing transaction ID", { status: 400 });
    }

    await prisma.transaction.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 