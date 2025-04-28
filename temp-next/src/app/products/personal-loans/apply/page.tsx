'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

export default function PersonalLoanApplicationPage() {
  const searchParams = useSearchParams();
  const loanType = searchParams.get('type') || 'personal-loan';
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanTerm: '',
    purpose: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employmentStatus: '',
    annualIncome: '',
    address: '',
    postcode: '',
  });

  const loanTypes = {
    'personal-loan': {
      title: 'Personal Loan',
      description: 'Flexible funding for your personal needs',
      range: '£1,000 - £25,000',
      apr: '6.9%',
      term: '1-7 years',
    },
    'home-improvement-loan': {
      title: 'Home Improvement Loan',
      description: 'Transform your home with our competitive rates',
      range: '£5,000 - £35,000',
      apr: '7.5%',
      term: '2-10 years',
    },
    'debt-consolidation-loan': {
      title: 'Debt Consolidation Loan',
      description: 'Simplify your finances and reduce monthly payments',
      range: '£5,000 - £35,000',
      apr: '7.9%',
      term: '1-10 years',
    },
  };

  const currentLoan = loanTypes[loanType as keyof typeof loanTypes] || loanTypes['personal-loan'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle final submission
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{currentLoan.title} Application</h1>
        <p className="text-xl text-gray-600">{currentLoan.description}</p>
      </div>

      <Card className="p-6">
        <div className="flex justify-between mb-8">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Loan Details</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Personal Details</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Financial Information</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="loanAmount">Loan Amount ({currentLoan.range})</Label>
                <Input
                  id="loanAmount"
                  name="loanAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="loanTerm">Loan Term ({currentLoan.term})</Label>
                <Select
                  name="loanTerm"
                  onValueChange={(value) => handleSelectChange('loanTerm', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 7 }, (_, i) => i + 1).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year} {year === 1 ? 'year' : 'years'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Select
                  name="purpose"
                  onValueChange={(value) => handleSelectChange('purpose', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home-improvement">Home Improvement</SelectItem>
                    <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                    <SelectItem value="car-purchase">Car Purchase</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  name="employmentStatus"
                  onValueChange={(value) => handleSelectChange('employmentStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed Full-Time</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Input
                  id="annualIncome"
                  name="annualIncome"
                  type="number"
                  placeholder="£"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              {step === 3 ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Important Information</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Representative APR: {currentLoan.apr}</li>
            <li>• Loan amount: {currentLoan.range}</li>
            <li>• Loan term: {currentLoan.term}</li>
            <li>• Subject to status and affordability</li>
            <li>• Your home may be repossessed if you do not keep up repayments</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 