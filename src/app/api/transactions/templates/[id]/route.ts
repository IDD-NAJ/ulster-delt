import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-middleware';

const prisma = new PrismaClient();

const UpdateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  reference: z.string().optional(),
});

const UseTemplateSchema = z.object({
  accountId: z.string().optional(), // If not provided, uses template's default account
  amount: z.number().positive().optional(), // If not provided, uses template's amount
  reference: z.string().optional(),
});

export const GET = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const template = await prisma.transactionTemplate.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
      include: {
        account: true,
        category: true
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  })
);

export const PATCH = withErrorHandler(
  withAuth(
    withValidation(UpdateTemplateSchema, async (data, req, { params }) => {
      const session = await getServerSession();
      const template = await prisma.transactionTemplate.findFirst({
        where: {
          id: params.id,
          userId: session?.user?.id,
        },
      });

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      const updatedTemplate = await prisma.transactionTemplate.update({
        where: { id: params.id },
        data,
        include: {
          account: true,
          category: true
        }
      });

      return NextResponse.json(updatedTemplate);
    })
  )
);

export const POST = withErrorHandler(
  withAuth(
    withValidation(UseTemplateSchema, async (data, req, { params }) => {
      const session = await getServerSession();
      const template = await prisma.transactionTemplate.findFirst({
        where: {
          id: params.id,
          userId: session?.user?.id,
        },
        include: {
          account: true
        }
      });

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      const transaction = await prisma.transaction.create({
        data: {
          userId: session?.user?.id!,
          accountId: data.accountId || template.accountId,
          type: template.type,
          amount: data.amount || template.amount,
          currency: template.currency,
          description: template.description,
          categoryId: template.categoryId,
          reference: data.reference || template.reference,
          status: 'COMPLETED',
          templateId: template.id
        },
        include: {
          account: true,
          category: true
        }
      });

      // Update account balance
      await prisma.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            [template.type === 'CREDIT' ? 'increment' : 'decrement']: transaction.amount
          }
        }
      });

      return NextResponse.json(transaction, { status: 201 });
    })
  )
);

export const DELETE = withErrorHandler(
  withAuth(async (req, { params }) => {
    const session = await getServerSession();
    const template = await prisma.transactionTemplate.findFirst({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    await prisma.transactionTemplate.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  })
); 