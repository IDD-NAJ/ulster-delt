'use client';

import { useState } from 'react';
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
import {
  Globe,
  ArrowRight,
  Calculator,
  Clock,
  AlertCircle,
  Search,
  Building
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate against EUR
};

const currencies: Currency[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.08 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.85 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 164.32 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.98 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.65 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.47 }
];

const recentTransfers = [
  {
    id: '1',
    recipient: 'John Smith',
    bank: 'Chase Bank',
    country: 'United States',
    amount: 1000,
    currency: 'USD',
    date: '2024-04-01'
  },
  {
    id: '2',
    recipient: 'Maria Garcia',
    bank: 'Santander',
    country: 'Spain',
    amount: 750,
    currency: 'EUR',
    date: '2024-03-28'
  }
];

export default function InternationalTransferPage() {
  const [recipientName, setRecipientName] = useState('');
  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [reference, setReference] = useState('');

  const calculateExchangeAmount = (amount: string, currency: string) => {
    const selectedRate = currencies.find(c => c.code === currency)?.rate || 1;
    const eurAmount = parseFloat(amount) / selectedRate;
    return isNaN(eurAmount) ? '0.00' : eurAmount.toFixed(2);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">International Transfer</h1>
          <p className="text-xl text-gray-600">Send money worldwide securely and quickly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Recipient Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recipient Name</Label>
                    <Input
                      placeholder="Enter full name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Recipient Country</Label>
                    <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="ES">Spain</SelectItem>
                        <SelectItem value="IT">Italy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      placeholder="Enter bank name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT/BIC Code</Label>
                    <Input
                      placeholder="Enter SWIFT/BIC code"
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>IBAN</Label>
                  <Input
                    placeholder="Enter IBAN"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reference (Optional)</Label>
                  <Input
                    placeholder="Add a reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                {amount && selectedCurrency !== 'EUR' && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertDescription>
                      Estimated amount in EUR: €{calculateExchangeAmount(amount, selectedCurrency)}
                      <br />
                      <span className="text-sm text-gray-500">
                        Exchange rate: 1 EUR = {currencies.find(c => c.code === selectedCurrency)?.rate} {selectedCurrency}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  className="w-full"
                  disabled={!recipientName || !bankName || !swiftCode || !iban || !amount || !selectedCurrency}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Review
                </Button>
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="md:col-span-1">
            {/* Quick Actions */}
            <Card className="p-6 mb-6">
              <h3 className="font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Track Transfer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="w-4 h-4 mr-2" />
                  Find SWIFT/BIC
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Transfers
                </Button>
              </div>
            </Card>

            {/* Recent Transfers */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Recent International Transfers</h3>
              <div className="space-y-4">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transfer.recipient}</p>
                      <p className="text-sm text-gray-500">{transfer.bank}</p>
                      <p className="text-sm text-gray-500">{transfer.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {currencies.find(c => c.code === transfer.currency)?.symbol}
                        {transfer.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transfer.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 