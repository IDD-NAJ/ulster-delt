import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request, context: { params: { id: string } }) {
  const userId = context.params.id;
  try {
    console.log("Fetching cards for user:", userId);
    const session = await getServerSession(authOptions);
    console.log("SESSION OBJECT:", session);

    // Check if user is authenticated
    if (!session?.user?.email) {
      console.log("Unauthorized: No session or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Checking admin status for:", session.user.email);
    
    // Check both AdminUser table and User table for admin privileges
    const [adminUser, regularUser] = await Promise.all([
      prisma.adminUser.findUnique({
        where: { email: session.user.email },
      }),
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      }),
    ]);

    const isAdmin = (adminUser && adminUser.role === "ADMIN") || 
                   (regularUser && regularUser.role === "ADMIN");

    if (!isAdmin) {
      console.log("Unauthorized: Not an admin");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Admin verified, fetching cards");
    // Fetch user's cards
    const cards = await prisma.card.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        cardNumber: true,
        expiryDate: true,
        status: true,
        type: true,
      },
    });

    console.log("Found cards:", cards.length);
    // Transform card data to only expose last 4 digits
    const transformedCards = cards.map(card => ({
      id: card.id,
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      status: card.status,
      type: card.type,
    }));

    return NextResponse.json(transformedCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch cards" },
      { status: 500 }
    );
  }
} 