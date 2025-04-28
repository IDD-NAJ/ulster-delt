import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export type ApiHandler = (
  req: Request,
  context: { params: Record<string, string> }
) => Promise<Response>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      if (error instanceof PrismaClientKnownRequestError) {
        return NextResponse.json(
          { error: 'Database error', code: error.code },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function withAuth(handler: ApiHandler): ApiHandler {
  return async (req, context) => {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(req, context);
  };
}

export function withValidation<T>(schema: any, handler: (data: T, req: Request, context: any) => Promise<Response>): ApiHandler {
  return async (req, context) => {
    const body = await req.json();
    const validatedData = schema.parse(body);
    return handler(validatedData, req, context);
  };
} 