import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { recurringTransactionSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-error";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: { userId: session.user.id },
      include: {
        account: true,
        category: true,
      },
      orderBy: { nextDue: "asc" },
    });

    return NextResponse.json(recurringTransactions);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = recurringTransactionSchema.parse(body);

    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: validatedData.accountId,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        account: true,
        category: true,
      },
    });

    return NextResponse.json(recurringTransaction, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
} 