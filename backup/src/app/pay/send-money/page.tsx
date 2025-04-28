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

type TransferData = {
  recipientName: string;
  accountNumber: string;
  amount: string;
  reference: string;
  transferType: string;
};

export default function SendMoneyPage() {
  const router = useRouter();
  const { translations } = useLanguage();
  const [formData, setFormData] = useState<TransferData>({
    recipientName: '',
    accountNumber: '',
    amount: '',
    reference: '',
    transferType: 'standard',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to process the transfer
    // For now, we'll just show a success message
    alert('Transfer initiated successfully!');
    router.push('/pay');
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Send Money</h1>
          <p className="text-xl text-gray-600">Transfer money securely to anyone</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
                placeholder="Enter recipient's name"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter account number"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">€</span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="Add a reference (optional)"
              />
            </div>

            <div>
              <Label htmlFor="transferType">Transfer Type</Label>
              <Select 
                value={formData.transferType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, transferType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transfer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Transfer (1-2 business days)</SelectItem>
                  <SelectItem value="instant">Instant Transfer (Additional fee applies)</SelectItem>
                  <SelectItem value="scheduled">Scheduled Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/pay')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                Send Money
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Important Information</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Transfers between Ulster Delt accounts are instant and free</li>
            <li>• Standard transfers to other banks take 1-2 business days</li>
            <li>• Maximum daily transfer limit applies</li>
            <li>• Keep your transfer details safe and secure</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 