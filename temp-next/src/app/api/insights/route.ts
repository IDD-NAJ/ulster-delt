import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get spending analysis
    const [currentMonthSpending, lastMonthSpending] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: "expense",
          date: {
            gte: startOfMonth,
            lte: now,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: "expense",
          date: {
            gte: startOfLastMonth,
            lt: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const currentSpending = currentMonthSpending._sum.amount || 0;
    const lastSpending = lastMonthSpending._sum.amount || 0;
    const spendingChange = lastSpending ? ((currentSpending - lastSpending) / lastSpending) * 100 : 0;

    // Get savings goal progress
    const savingsGoal = await prisma.savingsGoal.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get upcoming bills
    const upcomingBills = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        type: "expense",
        date: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get rewards points (mock data for now)
    const rewardsPoints = 2500;
    const rewardsChange = 500;

    return NextResponse.json({
      spendingAnalysis: {
        value: `£${currentSpending.toFixed(2)}`,
        change: `${spendingChange > 0 ? "+" : ""}${spendingChange.toFixed(0)}%`,
        trend: spendingChange > 0 ? "up" : spendingChange < 0 ? "down" : "neutral",
        period: "This month",
      },
      savingsGoal: {
        value: savingsGoal ? `${((savingsGoal.currentAmount / savingsGoal.targetAmount) * 100).toFixed(0)}%` : "0%",
        change: savingsGoal ? `£${savingsGoal.currentAmount.toFixed(2)}` : "£0.00",
        trend: "up",
        period: savingsGoal?.name || "No active goal",
      },
      billsDue: {
        value: upcomingBills.length.toString(),
        change: `£${upcomingBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}`,
        trend: "neutral",
        period: "Next 7 days",
      },
      rewardsPoints: {
        value: rewardsPoints.toString(),
        change: `+${rewardsChange}`,
        trend: "up",
        period: "This month",
      },
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 