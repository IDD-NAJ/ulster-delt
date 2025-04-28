'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

type FormData = {
  accountType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export default function OpenAccountPage() {
  const router = useRouter();
  const { translations } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    accountType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, accountType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to submit the application
    // For now, we'll just redirect to a success page
    router.push('/open-account/success');
  };

  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="accountType">{translations.accountType}</Label>
          <Select onValueChange={handleSelectChange} value={formData.accountType}>
            <SelectTrigger>
              <SelectValue placeholder={translations.accountType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking Account</SelectItem>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="business">Business Account</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="firstName">{translations.firstName}</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">{translations.lastName}</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <Button
        className="w-full mt-6"
        onClick={() => setCurrentStep(2)}
        disabled={!formData.accountType || !formData.firstName || !formData.lastName}
      >
        {translations.next}
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">{translations.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">{translations.phone}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
        >
          {translations.previous}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.email || !formData.phone}
        >
          {translations.submit}
        </Button>
      </div>
    </>
  );

  return (
    <div className="container mx-auto py-12 max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{translations.openAccount}</h1>
        <div className="text-sm text-gray-600">Step {currentStep} of 2</div>
      </div>

      <Card className="p-6">
        <form onSubmit={e => e.preventDefault()}>
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </form>
      </Card>
    </div>
  );
} 