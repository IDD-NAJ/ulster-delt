'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CalculationResult = {
  totalSavings: number;
  totalInterest: number;
  monthlyBreakdown: Array<{
    month: number;
    balance: number;
    interest: number;
  }>;
};

export default function SavingsCalculatorPage() {
  const [formData, setFormData] = useState({
    initialDeposit: '',
    monthlyContribution: '',
    interestRate: '',
    term: '',
    compoundingFrequency: 'monthly'
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateSavings = () => {
    const P = Number(formData.initialDeposit); // Principal
    const PMT = Number(formData.monthlyContribution); // Monthly payment
    const r = Number(formData.interestRate) / 100; // Annual interest rate
    const t = Number(formData.term); // Time in years
    const n = formData.compoundingFrequency === 'monthly' ? 12 : 1; // Compounding frequency

    let monthlyBreakdown = [];
    let balance = P;
    let totalInterest = 0;

    for (let month = 1; month <= t * 12; month++) {
      const monthlyRate = r / n;
      const interest = balance * monthlyRate / 12;
      balance += interest + PMT;
      totalInterest += interest;

      monthlyBreakdown.push({
        month,
        balance,
        interest
      });
    }

    setResult({
      totalSavings: balance,
      totalInterest,
      monthlyBreakdown
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateSavings();
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Savings Calculator</h1>
          <p className="text-xl text-gray-600">Plan your savings and see how your money can grow</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="initialDeposit">Initial Deposit (€)</Label>
                <Input
                  id="initialDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialDeposit}
                  onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="monthlyContribution">Monthly Contribution (€)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyContribution}
                  onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="term">Investment Term (Years)</Label>
                <Input
                  id="term"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                <Select
                  value={formData.compoundingFrequency}
                  onValueChange={(value) => setFormData({ ...formData, compoundingFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Calculate</Button>
            </form>
          </Card>

          {/* Results */}
          {result && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Results</h2>
              
              <div className="space-y-6">
                <div>
                  <Label>Total Savings</Label>
                  <p className="text-3xl font-bold text-green-600">
                    €{result.totalSavings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div>
                  <Label>Total Interest Earned</Label>
                  <p className="text-2xl font-semibold text-blue-600">
                    €{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div>
                  <Label>Initial Investment</Label>
                  <p className="text-xl">
                    €{Number(formData.initialDeposit).toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label>Total Contributions</Label>
                  <p className="text-xl">
                    €{(Number(formData.monthlyContribution) * Number(formData.term) * 12).toLocaleString()}
                  </p>
                </div>
              </div>

              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is an estimate based on a fixed interest rate. Actual returns may vary.
                </AlertDescription>
              </Alert>
            </Card>
          )}
        </div>

        {/* Tips and Information */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Savings Tips</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Start early to take advantage of compound interest</li>
            <li>• Regular contributions can significantly boost your savings</li>
            <li>• Consider different investment options for potentially higher returns</li>
            <li>• Review and adjust your savings plan periodically</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 