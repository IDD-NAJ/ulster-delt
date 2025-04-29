import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CardType, CardStatus } from "@prisma/client";

// Helper function to generate a random card number
function generateCardNumber() {
  const prefix = '4532'; // Visa-like prefix
  const remainingDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
  return prefix + remainingDigits;
}

// Helper function to generate expiry date (2 years from now)
function generateExpiryDate() {
  const now = new Date();
  return new Date(now.getFullYear() + 2, now.getMonth());
}

// Helper function to generate CVV
function generateCVV() {
  return Math.floor(Math.random() * 900) + 100; // 3-digit number
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { accountId } = data;

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Verify account ownership
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found or unauthorized' }, { status: 404 });
    }

    // Generate card details
    const cardNumber = generateCardNumber();
    const expiryDate = generateExpiryDate();
    const cvv = generateCVV();

    // Create new card
    const card = await prisma.card.create({
      data: {
        accountId,
        userId: account.userId,
        cardNumber,
        expiryDate,
        cvv: cvv.toString(),
        status: CardStatus.ACTIVE,
        type: CardType.CREDIT,
        dailyLimit: 1000,
        monthlyLimit: 10000,
        isVirtual: false,
      },
    });

    return NextResponse.json({
      message: 'Card created successfully',
      card: {
        id: card.id,
        lastFourDigits: cardNumber.slice(-4),
        expiryDate: card.expiryDate,
        status: card.status,
        type: card.type,
      },
    });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get account ID from query params
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Verify account ownership first
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found or unauthorized' }, { status: 404 });
    }

    // Get cards for the verified account
    const cards = await prisma.card.findMany({
      where: {
        accountId,
        account: {
          user: {
            email: session.user.email,
          },
        },
      },
      select: {
        id: true,
        cardNumber: true,
        expiryDate: true,
        status: true,
        type: true,
      },
    });

    // Transform card data to only expose last 4 digits
    const transformedCards = cards.map(card => ({
      id: card.id,
      lastFourDigits: card.cardNumber.slice(-4),
      expiryDate: card.expiryDate,
      status: card.status,
      type: card.type,
    }));

    console.log('API Response:', JSON.stringify(transformedCards, null, 2));
    return NextResponse.json(transformedCards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch cards' },
      { status: 500 }
    );
  }
} 