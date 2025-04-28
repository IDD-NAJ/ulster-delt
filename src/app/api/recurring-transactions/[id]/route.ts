import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const recurringTransaction = await prisma.recurringTransaction.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
      },
    });

    if (!recurringTransaction) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(recurringTransaction);
  } catch (error) {
    console.error("Error fetching recurring transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { amount, description, frequency, startDate, endDate } = body;

    const recurringTransaction = await prisma.recurringTransaction.update({
      where: {
        id: params.id,
      },
      data: {
        amount,
        description,
        frequency,
        startDate: new Date(startDate),
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.recurringTransaction.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting recurring transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
} 