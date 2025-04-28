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
    const { twoFactor, biometric, loginAlerts } = body;

    const security = await prisma.userSecuritySettings.upsert({
      where: { userEmail: session.user.email },
      update: {
        twoFactorEnabled: twoFactor,
        biometricEnabled: biometric,
        loginAlertsEnabled: loginAlerts,
      },
      create: {
        userEmail: session.user.email,
        twoFactorEnabled: twoFactor,
        biometricEnabled: biometric,
        loginAlertsEnabled: loginAlerts,
      },
    });

    return NextResponse.json(security);
  } catch (error) {
    console.error('Security settings update error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 