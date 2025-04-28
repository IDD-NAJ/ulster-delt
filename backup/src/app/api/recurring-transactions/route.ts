import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(recurringTransactions);
  } catch (error) {
    console.error("Error fetching recurring transactions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      description,
      type,
      amount,
      currency,
      frequency,
      startDate,
      endDate,
    } = body;

    if (!description || !type || !amount || !currency || !frequency || !startDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        description,
        type,
        amount,
        currency,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(recurringTransaction);
  } catch (error) {
    console.error("Error creating recurring transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 