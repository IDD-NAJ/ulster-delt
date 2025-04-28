'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Lock,
  Globe,
  Smartphone,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Settings,
  ChevronRight
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type BankCard = {
  id: string;
  type: 'credit' | 'debit';
  number: string;
  expiryDate: string;
  cardHolder: string;
  status: 'active' | 'blocked' | 'expired';
  spendingLimit: number;
  currentSpending: number;
  isContactless: boolean;
  isOnlinePurchases: boolean;
  isATM: boolean;
};

const mockCards: BankCard[] = [
  {
    id: '1',
    type: 'debit',
    number: '****-****-****-1234',
    expiryDate: '12/25',
    cardHolder: 'JOHN DOE',
    status: 'active',
    spendingLimit: 2000,
    currentSpending: 850,
    isContactless: true,
    isOnlinePurchases: true,
    isATM: true
  },
  {
    id: '2',
    type: 'credit',
    number: '****-****-****-5678',
    expiryDate: '06/26',
    cardHolder: 'JOHN DOE',
    status: 'active',
    spendingLimit: 5000,
    currentSpending: 1200,
    isContactless: true,
    isOnlinePurchases: true,
    isATM: true
  }
];

export default function CardManagementPage() {
  const [selectedCard, setSelectedCard] = useState<BankCard>(mockCards[0]);

  const getSpendingPercentage = (current: number, limit: number) => {
    return (current / limit) * 100;
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Card Management</h1>
          <p className="text-xl text-gray-600">Manage and control your cards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card List */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Cards</h2>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>

            {mockCards.map((card) => (
              <Card
                key={card.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedCard.id === card.id
                    ? 'border-primary shadow-md'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedCard(card)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-8 h-8 mr-3" />
                    <div>
                      <p className="font-medium">{card.number}</p>
                      <p className="text-sm text-gray-500 capitalize">{card.type} Card</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          {/* Card Details and Controls */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Card Details</h2>
                  <p className="text-gray-500">
                    {selectedCard.type === 'credit' ? 'Credit' : 'Debit'} Card ending in{' '}
                    {selectedCard.number.slice(-4)}
                  </p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Card Settings
                </Button>
              </div>

              {/* Card Status */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    selectedCard.status === 'active'
                      ? 'bg-green-500'
                      : selectedCard.status === 'blocked'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`} />
                  <span className="capitalize">{selectedCard.status}</span>
                </div>
              </div>

              {/* Spending Limit */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Spending Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Spending</span>
                    <span>€{selectedCard.currentSpending} / €{selectedCard.spendingLimit}</span>
                  </div>
                  <Progress
                    value={getSpendingPercentage(
                      selectedCard.currentSpending,
                      selectedCard.spendingLimit
                    )}
                  />
                </div>
              </div>

              {/* Card Controls */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Card Controls</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      <Label>Contactless Payments</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Enable or disable contactless payments
                    </p>
                  </div>
                  <Switch
                    checked={selectedCard.isContactless}
                    onCheckedChange={() => {}}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <Label>Online Purchases</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Allow online and international purchases
                    </p>
                  </div>
                  <Switch
                    checked={selectedCard.isOnlinePurchases}
                    onCheckedChange={() => {}}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <Label>ATM Withdrawals</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Enable ATM cash withdrawals
                    </p>
                  </div>
                  <Switch
                    checked={selectedCard.isATM}
                    onCheckedChange={() => {}}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Block Card
                  </Button>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Report Lost
                  </Button>
                </div>
              </div>

              {/* Security Alert */}
              {selectedCard.currentSpending > selectedCard.spendingLimit * 0.8 && (
                <Alert className="mt-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You are approaching your spending limit. Consider reviewing your expenses.
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 