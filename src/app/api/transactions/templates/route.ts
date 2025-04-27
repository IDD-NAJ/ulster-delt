import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const TemplateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['DEBIT', 'CREDIT']),
  amount: z.number().positive(),
  currency: z.string(),
  description: z.string(),
  categoryId: z.string().optional(),
  accountId: z.string(),
  reference: z.string().optional(),
});

export const GET = withErrorHandler(
  withAuth(async (req) => {
    const session = await getServerSession();
    
    const templates = await prisma.transactionTemplate.findMany({
      where: { userId: session?.user?.id },
      include: {
        account: true,
        category: true,
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(templates);
  })
);

export const POST = withErrorHandler(
  withAuth(
    withValidation(TemplateSchema, async (data, req) => {
      const session = await getServerSession();

      const template = await prisma.transactionTemplate.create({
        data: {
          ...data,
          userId: session?.user?.id!
        },
        include: {
          account: true,
          category: true
        }
      });

      return NextResponse.json(template, { status: 201 });
    })
  )
); 