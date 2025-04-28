import { NextResponse } from 'next/server';
import { AdminUser } from '@/models/AdminUser';
import { AdminAuthService } from '@/services/adminAuth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
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

    const decoded = await AdminAuthService.verifyToken(token);
    const admin = await AdminUser.getAdminUserById(decoded.id);

    if (!admin) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current and new passwords are required' },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AdminUser.updateAdminUser(admin.id, { password: hashedPassword });

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to change password' },
      { status: 500 }
    );
  }
} 