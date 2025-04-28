import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      marketingEmails,
      transactionAlerts,
      securityAlerts,
      balanceAlerts,
    } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { notificationPreferences: true },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const updatedPreferences = await prisma.notificationPreferences.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        emailNotifications,
        smsNotifications,
        pushNotifications,
        marketingEmails,
        transactionAlerts,
        securityAlerts,
        balanceAlerts,
      },
      update: {
        emailNotifications,
        smsNotifications,
        pushNotifications,
        marketingEmails,
        transactionAlerts,
        securityAlerts,
        balanceAlerts,
      },
    });

    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 