import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: UserRole;
      };

      if (decoded.role !== UserRole.ADMIN) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 403 }
        );
      }

      const admin = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!admin) {
        return NextResponse.json(
          { message: 'Admin not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        admin: {
          id: admin.id,
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch admin info' },
      { status: 500 }
    );
  }
} 