import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const CategorySchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
});

export const GET = withErrorHandler(
  withAuth(async (req) => {
    const session = await getServerSession();
    
    // Get all categories with usage count
    const categories = await prisma.transactionCategory.findMany({
      where: { userId: session?.user?.id },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    return NextResponse.json(categories);
  })
);

export const POST = withErrorHandler(
  withAuth(
    withValidation(CategorySchema, async (data, req) => {
      const session = await getServerSession();

      const category = await prisma.transactionCategory.create({
        data: {
          ...data,
          userId: session?.user?.id!
        }
      });

      return NextResponse.json(category, { status: 201 });
    })
  )
); 