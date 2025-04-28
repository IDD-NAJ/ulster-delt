"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createRecurringTransaction(data: {
  amount: number;
  description: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.accounts.length) {
      throw new Error("No accounts found");
    }

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        frequency: data.frequency as any,
        startDate: data.startDate,
        endDate: data.endDate,
        nextDue: data.startDate,
        userId: user.id,
        accountId: user.accounts[0].id,
        type: "DEBIT",
        currency: "EUR",
        status: "ACTIVE",
      },
    });

    revalidatePath("/recurring-transactions");
    return { success: true, data: recurringTransaction };
  } catch (error) {
    console.error("Error creating recurring transaction:", error);
    return { success: false, error: "Failed to create recurring transaction" };
  }
} 