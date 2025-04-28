import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const UpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
});

export const GET = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const category = await prisma.transactionCategory.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
      include: {
        _count: {
          select: { transactions: true }
        },
        transactions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  })
);

export const PATCH = withErrorHandler(
  withAuth(
    withValidation(UpdateCategorySchema, async (data, req, { params }) => {
      const session = await getServerSession();
      const category = await prisma.transactionCategory.findFirst({
        where: {
          id: params.id,
          userId: session?.user?.id,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      const updatedCategory = await prisma.transactionCategory.update({
        where: { id: params.id },
        data,
      });

      return NextResponse.json(updatedCategory);
    })
  )
);

export const DELETE = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const category = await prisma.transactionCategory.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update all transactions with this category to have no category
    await prisma.transaction.updateMany({
      where: { categoryId: params.id },
      data: { categoryId: null }
    });

    await prisma.transactionCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  })
); 