'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const securityQuestions = [
  "In which city were you born?",
  "What was your mother's maiden name?",
  "What was the name of your first pet?",
  "What was the name of your first school?",
  "What was your childhood nickname?",
  "In which city did you meet your spouse/significant other?",
  "What is the name of the street you grew up on?",
  "What was the make of your first car?",
] as const;

type SecurityQuestion = typeof securityQuestions[number];
type IdentificationType = 'ssn' | 'iban';

const baseSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  pin: z.string().length(4, 'PIN must be exactly 4 digits'),
  confirmPin: z.string().length(4, 'Please confirm your PIN'),
  identificationType: z.enum(['ssn', 'iban'] as const, { required_error: 'Please select an identification type' }),
  identificationNumber: z.string().min(1, 'Identification number is required'),
  securityQuestion: z.enum(securityQuestions, { required_error: 'Please select a security question' }),
  securityAnswer: z.string().min(1, 'Security answer is required')
});

const step1Schema = z.object({
  email: baseSchema.shape.email,
  password: baseSchema.shape.password,
  confirmPassword: baseSchema.shape.confirmPassword,
  firstName: baseSchema.shape.firstName,
  lastName: baseSchema.shape.lastName,
  dateOfBirth: baseSchema.shape.dateOfBirth,
  phoneNumber: baseSchema.shape.phoneNumber,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const step2Schema = z.object({
  streetAddress: baseSchema.shape.streetAddress,
  city: baseSchema.shape.city,
  state: baseSchema.shape.state,
  postalCode: baseSchema.shape.postalCode,
  country: baseSchema.shape.country,
});

const step3Schema = z.object({
  pin: baseSchema.shape.pin,
  confirmPin: baseSchema.shape.confirmPin,
  identificationType: baseSchema.shape.identificationType,
  identificationNumber: baseSchema.shape.identificationNumber,
  securityQuestion: baseSchema.shape.securityQuestion,
  securityAnswer: z.string().min(2, 'Security answer must be at least 2 characters')
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

const registerSchema = baseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  });

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    pin: '',
    confirmPin: '',
    identificationType: 'ssn',
    identificationNumber: '',
    securityQuestion: securityQuestions[0],
    securityAnswer: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'pin' || name === 'confirmPin') {
      // Only allow numbers and limit to 4 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'identificationNumber' && formData.identificationType === 'ssn') {
      // Only allow numbers and limit to 9 digits for SSN
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'phoneNumber') {
      // Only allow numbers for phone number
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    // Allow only numbers for PIN, SSN, and phone fields
    if ((name === 'pin' || name === 'confirmPin' || 
         (name === 'identificationNumber' && formData.identificationType === 'ssn') ||
         name === 'phoneNumber') && !/[\d]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    if (name === 'identificationType') {
      const idType = value as IdentificationType;
      setFormData(prev => ({
        ...prev,
        identificationType: idType,
        identificationNumber: '' // Clear the identification number when switching types
      }));
    } else if (name === 'securityQuestion') {
      const question = value as SecurityQuestion;
      setFormData(prev => ({
        ...prev,
        securityQuestion: question
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (stepNumber: number) => {
    try {
      switch (stepNumber) {
        case 1:
          step1Schema.parse(formData);
          break;
        case 2:
          step2Schema.parse(formData);
          break;
        case 3:
          step3Schema.parse(formData);
          break;
        default:
          return false;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Please fill in all required fields correctly');
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const validatedData = registerSchema.parse(formData);
      
      // Validate PIN format
      if (!/^\d{4}$/.test(validatedData.pin)) {
        throw new Error('PIN must be exactly 4 digits');
      }

      // Validate SSN format if SSN is selected
      if (validatedData.identificationType === 'ssn' && !/^\d{9}$/.test(validatedData.identificationNumber)) {
        throw new Error('SSN must be exactly 9 digits');
      }

      // Validate IBAN format if IBAN is selected
      if (validatedData.identificationType === 'iban' && !/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(validatedData.identificationNumber)) {
        throw new Error('Please enter a valid IBAN');
      }

      // Validate security answer
      if (!validatedData.securityAnswer || validatedData.securityAnswer.trim().length < 2) {
        throw new Error('Please provide a valid security answer');
      }
      
      // Remove confirmation fields before sending to API
      const { confirmPassword, confirmPin, ...dataToSend } = validatedData;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Handle validation errors from the API
          const newErrors: Record<string, string> = {};
          data.details.forEach((err: any) => {
            if (err.path[0]) {
              newErrors[err.path[0]] = err.message;
            }
          });
          setErrors(newErrors);
          toast.error('Please check your information and try again.');
        } else {
          throw new Error(data.error || 'Registration failed');
        }
        return;
      }

      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Please check your information and try again.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        toast.error(errorMessage);
        console.error('Registration error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-600">Step {step} of 3</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-2 w-16 rounded-full ${
                  num <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Basic Information</h2>
            <div className="space-y-1">
              <Input
                name="email"
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="password"
                type="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <p className="text-sm text-gray-500">Must be at least 8 characters</p>
            </div>
            <div className="space-y-1">
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className={errors.dateOfBirth ? 'border-red-500' : ''}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
            <Button type="button" onClick={nextStep} className="w-full">Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Address Information</h2>
            <div className="space-y-1">
              <Input
                name="streetAddress"
                placeholder="Street Address *"
                value={formData.streetAddress}
                onChange={handleInputChange}
                required
                className={errors.streetAddress ? 'border-red-500' : ''}
              />
              {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="city"
                placeholder="City *"
                value={formData.city}
                onChange={handleInputChange}
                required
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="state"
                placeholder="State *"
                value={formData.state}
                onChange={handleInputChange}
                required
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="postalCode"
                placeholder="Postal Code *"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="country"
                placeholder="Country *"
                value={formData.country}
                onChange={handleInputChange}
                required
                className={errors.country ? 'border-red-500' : ''}
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>
            <div className="flex gap-4">
              <Button type="button" onClick={prevStep} variant="outline" className="w-full">Previous</Button>
              <Button type="button" onClick={nextStep} className="w-full">Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Security Information</h2>
            <div className="space-y-1">
              <Input
                name="pin"
                type="password"
                inputMode="numeric"
                placeholder="4-digit PIN *"
                maxLength={4}
                pattern="\d{4}"
                value={formData.pin}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                required
                className={errors.pin ? 'border-red-500' : ''}
              />
              {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}
              <p className="text-sm text-gray-500">Must be exactly 4 digits (0-9)</p>
            </div>
            <div className="space-y-1">
              <Input
                name="confirmPin"
                type="password"
                inputMode="numeric"
                placeholder="Confirm PIN *"
                maxLength={4}
                pattern="\d{4}"
                value={formData.confirmPin}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                required
                className={errors.confirmPin ? 'border-red-500' : ''}
              />
              {errors.confirmPin && <p className="text-red-500 text-sm">{errors.confirmPin}</p>}
            </div>
            <div className="space-y-1">
              <Select
                onValueChange={handleSelectChange('identificationType')}
                value={formData.identificationType}
              >
                <SelectTrigger className={errors.identificationType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select ID Type *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssn">Social Security Number (SSN)</SelectItem>
                  <SelectItem value="iban">International Bank Account Number (IBAN)</SelectItem>
                </SelectContent>
              </Select>
              {errors.identificationType && <p className="text-red-500 text-sm">{errors.identificationType}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="identificationNumber"
                type={formData.identificationType === 'ssn' ? 'password' : 'text'}
                inputMode={formData.identificationType === 'ssn' ? 'numeric' : 'text'}
                placeholder={`${formData.identificationType === 'ssn' ? 'SSN' : 'IBAN'} Number *`}
                maxLength={formData.identificationType === 'ssn' ? 9 : 34}
                pattern={formData.identificationType === 'ssn' ? '\\d{9}' : '[A-Z]{2}\\d{2}[A-Z0-9]{1,30}'}
                value={formData.identificationNumber}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                required
                className={errors.identificationNumber ? 'border-red-500' : ''}
              />
              {errors.identificationNumber && <p className="text-red-500 text-sm">{errors.identificationNumber}</p>}
              <p className="text-sm text-gray-500">
                {formData.identificationType === 'ssn' 
                  ? 'Must be exactly 9 digits (0-9)'
                  : 'Format: XX00XXXX... (Country code + check digits + BBAN)'}
              </p>
            </div>
            <div className="space-y-1">
              <Select
                onValueChange={handleSelectChange('securityQuestion')}
                value={formData.securityQuestion}
                required
              >
                <SelectTrigger className={errors.securityQuestion ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Security Question *" />
                </SelectTrigger>
                <SelectContent>
                  {securityQuestions.map((question) => (
                    <SelectItem key={question} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.securityQuestion && <p className="text-red-500 text-sm">{errors.securityQuestion}</p>}
            </div>
            <div className="space-y-1">
              <Input
                name="securityAnswer"
                type="text"
                placeholder="Security Answer *"
                value={formData.securityAnswer}
                onChange={handleInputChange}
                required
                className={errors.securityAnswer ? 'border-red-500' : ''}
              />
              {errors.securityAnswer && <p className="text-red-500 text-sm">{errors.securityAnswer}</p>}
              <p className="text-sm text-gray-500">Must be at least 2 characters</p>
            </div>
            <div className="flex gap-4">
              <Button 
                type="button" 
                onClick={prevStep} 
                variant="outline" 
                className="w-full"
                disabled={isSubmitting}
              >
                Previous
              </Button>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </div>
        )}
      </form>
      <div className="text-center text-sm mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 