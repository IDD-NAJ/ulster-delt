import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return new NextResponse('Missing file or type', { status: 400 });
    }

    // TODO: Implement file upload to your preferred storage service (S3, etc.)
    // For now, we'll just store the metadata
    const document = await prisma.userDocument.create({
      data: {
        userEmail: session.user.email,
        type,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        status: 'PENDING_REVIEW',
      },
    });

    return NextResponse.json({
      id: document.id,
      type: document.type,
      status: document.status,
      url: '/api/documents/' + document.id, // Placeholder URL
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 