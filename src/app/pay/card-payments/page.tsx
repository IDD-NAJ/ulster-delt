'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Lock,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  Globe
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CardDetails = {
  type: string;
  number: string;
  expiryDate: string;
  status: 'active' | 'blocked';
};

const cards: CardDetails[] = [
  {
    type: 'Debit Mastercard',
    number: '**** **** **** 1234',
    expiryDate: '12/25',
    status: 'active',
  },
  {
    type: 'Virtual Card',
    number: '**** **** **** 5678',
    expiryDate: '06/24',
    status: 'active',
  }
];

export default function CardPaymentsPage() {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState('1000');

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Card Payments</h1>
          <p className="text-xl text-gray-600">Manage your cards and payment settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cards.map((card, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{card.type}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">
                      {showCardNumber ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCardNumber(!showCardNumber)}
                    >
                      {showCardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Expires: {card.expiryDate}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Payment Limit</label>
                  <Select
                    value={selectedLimit}
                    onValueChange={setSelectedLimit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">€500 per day</SelectItem>
                      <SelectItem value="1000">€1,000 per day</SelectItem>
                      <SelectItem value="2500">€2,500 per day</SelectItem>
                      <SelectItem value="5000">€5,000 per day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Lock className="w-4 h-4 mr-2" />
                    Block Card
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Card Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Contactless Payments</span>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-gray-500" />
                  <span>International Payments</span>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3 text-gray-500" />
                  <span>3D Secure</span>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Button className="w-full justify-start">
                <CreditCard className="w-5 h-5 mr-3" />
                Order New Card
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Smartphone className="w-5 h-5 mr-3" />
                Add to Digital Wallet
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Lock className="w-5 h-5 mr-3" />
                Change PIN
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 