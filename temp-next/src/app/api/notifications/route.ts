import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId: string | null = null;
    if (session?.user?.id) {
      userId = session.user.id;
    } else if (session?.user?.email) {
      // fallback: fetch user by email
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      userId = user?.id || null;
    }

    const notifications = await prisma.notification.findMany({
      where: {
        isActive: true,
        OR: [
          { userId: null },
          { userId: userId },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.message || !data.type || !data.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const notification = await prisma.notification.create({
      data: {
        message: data.message,
        type: data.type, // e.g., "warning"
        userId: data.userId,
        isActive: true,
      },
    });
    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save notification" }, { status: 500 });
  }
} 