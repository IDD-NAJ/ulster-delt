import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, dob } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, email, phone, dateOfBirth: dob },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 