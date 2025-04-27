import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { accountSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-error";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = accountSchema.parse(body);

    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    const updatedAccount = await prisma.account.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Check if account has transactions
    const transactionCount = await prisma.transaction.count({
      where: { accountId: params.id },
    });

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete account with existing transactions" },
        { status: 400 }
      );
    }

    await prisma.account.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
} 