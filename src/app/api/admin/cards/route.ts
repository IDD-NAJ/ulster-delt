import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface Card {
  id: string;
  userId: string;
  accountId: string;
  cardNumber: string;
  expiryDate: Date;
  cvv: string;
  type: 'DEBIT' | 'CREDIT';
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(req: Request) {
  try {
    const { userId, type } = await req.json();
    
    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Find user's primary checking account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: { type: 'CHECKING' },
          take: 1,
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    if (!user.accounts || user.accounts.length === 0) {
      return new NextResponse('User has no checking account', { status: 400 });
    }

    // Generate card details
    const cardNumber = generateCardNumber();
    const expiryDate = generateExpiryDate();
    const cvv = generateCVV();

    // Create the card with account association
    const [newCard] = await prisma.$queryRaw<Card[]>`
      INSERT INTO "Card" (
        "id", "userId", "accountId", "cardNumber", "expiryDate", "cvv", 
        "type", "status", "createdAt", "updatedAt"
      ) 
      VALUES (
        gen_random_uuid(), ${userId}, ${user.accounts[0].id}, ${cardNumber}, ${expiryDate}, ${cvv},
        ${type || 'DEBIT'}, 'ACTIVE', NOW(), NOW()
      )
      RETURNING *;
    `;

    return NextResponse.json(newCard);
  } catch (error) {
    console.error('Error creating card:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Error creating card', 
      { status: 500 }
    );
  }
}

// Helper functions
function generateCardNumber(): string {
  const prefix = '4532'; // Example prefix for demo
  const random = Math.random().toString().slice(2, 14).padStart(12, '0');
  return prefix + random;
}

function generateExpiryDate(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  return date;
}

function generateCVV(): string {
  return Math.floor(Math.random() * 900 + 100).toString();
}

interface CardWithAccount extends Card {
  accountType: string;
  accountNumber: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    const cards = await prisma.$queryRaw<Card[]>`
      SELECT 
        c.*,
        a.type as "accountType",
        a."accountNumber"
      FROM "Card" c
      JOIN "Account" a ON c."accountId" = a.id
      WHERE c."userId" = ${userId}
      ORDER BY c."createdAt" DESC;
    `;

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Error fetching cards',
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { cardId, status } = await req.json();

    if (!cardId) {
      return new NextResponse('Card ID is required', { status: 400 });
    }

    if (status && !['ACTIVE', 'BLOCKED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    const query = Prisma.sql`
      UPDATE "Card"
      SET "status" = ${status}, "updatedAt" = NOW()
      WHERE id = ${cardId}
      RETURNING *;
    `;

    const [updatedCard] = await prisma.$queryRaw<Card[]>(query);

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Error updating card',
      { status: 500 }
    );
  }
} 