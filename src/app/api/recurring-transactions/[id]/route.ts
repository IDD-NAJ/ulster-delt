import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const recurringTransaction = await prisma.recurringTransaction.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        account: true,
        category: true,
      },
    });

    if (!recurringTransaction) {
      return new NextResponse("Recurring transaction not found", { status: 404 });
    }

    return NextResponse.json(recurringTransaction);
  } catch (error) {
    console.error("Error fetching recurring transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const recurringTransaction = await prisma.recurringTransaction.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        description,
        type,
        amount,
        currency,
        frequency,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(recurringTransaction);
  } catch (error) {
    console.error("Error updating recurring transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.recurringTransaction.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting recurring transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
} 