'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function PersonalLoanCalculatorPage() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(3);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalRepayable, setTotalRepayable] = useState(0);
  const [apr, setApr] = useState(6.9);
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, loanTerm, apr]);

  const calculateLoan = () => {
    const monthlyInterestRate = (apr / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = (
      loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    );
    
    setMonthlyPayment(monthlyPayment);
    setTotalRepayable(monthlyPayment * numberOfPayments);
  };

  const handleApplyNow = () => {
    const params = new URLSearchParams({
      amount: loanAmount.toString(),
      term: loanTerm.toString(),
      purpose: purpose,
      apr: apr.toString(),
    });
    router.push(`/products/personal-loans/apply?${params.toString()}`);
  };

  const getProgressValue = () => {
    return ((loanAmount - 1000) / (35000 - 1000)) * 100;
  };

  return (
    <div className="container mx-auto py-12 max-w-3xl px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Personal Loan Calculator</h1>
        <p className="text-xl text-gray-600">Calculate your monthly payments and total cost</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <div className="space-y-4">
                <div className="relative">
                  <Slider
                    id="loanAmount"
                    min={1000}
                    max={35000}
                    step={100}
                    value={[loanAmount]}
                    onValueChange={(value) => setLoanAmount(value[0])}
                  />
                  <Progress value={getProgressValue()} className="mt-2" />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>£1,000</span>
                    <span>£35,000</span>
                  </div>
                </div>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  min={1000}
                  max={35000}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="loanTerm">Loan Term (Years)</Label>
              <div className="space-y-4">
                <Slider
                  id="loanTerm"
                  min={1}
                  max={7}
                  step={1}
                  value={[loanTerm]}
                  onValueChange={(value) => setLoanTerm(value[0])}
                />
                <Input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  min={1}
                  max={7}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">Loan Purpose</Label>
              <Select
                value={purpose}
                onValueChange={setPurpose}
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

            <div>
              <Label htmlFor="apr">Representative APR (%)</Label>
              <Input
                id="apr"
                type="number"
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                step={0.1}
                min={0}
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Results</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Monthly Payment</Label>
                  <p className="text-3xl font-bold text-primary">
                    £{monthlyPayment.toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label>Total Amount Repayable</Label>
                  <p className="text-2xl font-semibold text-gray-700">
                    £{totalRepayable.toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label>Total Interest</Label>
                  <p className="text-xl text-gray-600">
                    £{(totalRepayable - loanAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleApplyNow}
                disabled={!purpose}
              >
                Continue to Application
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Important Information</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• This calculator provides an illustration only and does not guarantee loan approval.</p>
          <p>• The actual APR you receive may vary based on your circumstances.</p>
          <p>• Loans are subject to status and affordability checks.</p>
          <p>• Representative APR shown is for loans between £7,500 and £25,000.</p>
          <p>• Your monthly payments may vary if the Bank of England base rate changes.</p>
        </div>
      </Card>
    </div>
  );
} 