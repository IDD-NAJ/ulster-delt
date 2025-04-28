import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  pin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^\d{4}$/, 'PIN must contain only digits'),
  identificationType: z.enum(['ssn', 'iban'], { required_error: 'Please select an identification type' }),
  identificationNumber: z.string().min(1, 'Identification number is required')
    .superRefine((val, ctx) => {
      const idType = ctx.path[ctx.path.length - 2] === 'identificationType' 
        ? ctx.path[ctx.path.length - 1] 
        : ctx.parent?.identificationType;

      if (idType === 'ssn' && !/^\d{9}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'SSN must be exactly 9 digits'
        });
        return false;
      }
      
      if (idType === 'iban' && !/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IBAN must start with country code followed by check digits and BBAN'
        });
        return false;
      }

      return true;
    }),
  securityQuestion: z.string().min(1, 'Security question is required'),
  securityAnswer: z.string().min(2, 'Security answer must be at least 2 characters')
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash sensitive data
    const hashedPassword = await hash(validatedData.password, 12);
    const hashedPin = await hash(validatedData.pin, 12);
    const hashedSecurityAnswer = await hash(validatedData.securityAnswer.toLowerCase().trim(), 12);

    // Create user with all related information
    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: validatedData.dateOfBirth,
        phoneNumber: validatedData.phoneNumber,
        address: {
          create: {
            street: validatedData.streetAddress,
            city: validatedData.city,
            state: validatedData.state,
            postalCode: validatedData.postalCode,
            country: validatedData.country,
          },
        },
        securityInfo: {
          create: {
            pin: hashedPin,
            identificationType: validatedData.identificationType,
            identificationNumber: validatedData.identificationNumber,
            securityQuestion: validatedData.securityQuestion,
            securityAnswer: hashedSecurityAnswer,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({
      data: {
        user,
        },
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: error.errors.map(err => ({
            path: err.path,
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
} 