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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  RepeatIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  AlertCircleIcon,
  ClockIcon,
  CalendarRangeIcon
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type StandingOrder = {
  id: string;
  recipientName: string;
  accountNumber: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextPayment: string;
  status: 'active' | 'paused' | 'cancelled';
  description: string;
};

const mockStandingOrders: StandingOrder[] = [
  {
    id: '1',
    recipientName: 'John Smith',
    accountNumber: 'IE29AIBK93115212345678',
    amount: 800.00,
    frequency: 'monthly',
    nextPayment: '2024-05-01',
    status: 'active',
    description: 'Rent Payment'
  },
  {
    id: '2',
    recipientName: 'Dublin Fitness',
    accountNumber: 'IE29AIBK93115287654321',
    amount: 45.00,
    frequency: 'monthly',
    nextPayment: '2024-04-15',
    status: 'active',
    description: 'Gym Membership'
  },
  {
    id: '3',
    recipientName: 'Car Insurance Co',
    accountNumber: 'IE29AIBK93115298765432',
    amount: 150.00,
    frequency: 'quarterly',
    nextPayment: '2024-06-01',
    status: 'paused',
    description: 'Car Insurance'
  }
];

export default function StandingOrdersPage() {
  const [frequency, setFrequency] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'paused':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Every week';
      case 'monthly':
        return 'Every month';
      case 'quarterly':
        return 'Every 3 months';
      case 'annually':
        return 'Every year';
      default:
        return frequency;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Standing Orders</h1>
          <p className="text-xl text-gray-600">Manage your recurring payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Standing Order Form */}
          <div className="md:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">New Standing Order</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipient Name</Label>
                  <Input
                    placeholder="Enter recipient name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Number (IBAN)</Label>
                  <Input
                    placeholder="IE29AIBK93115212345678"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="€0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Enter payment description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full"
                  disabled={!recipientName || !accountNumber || !amount || !frequency || !startDate}
                >
                  Set Up Standing Order
                </Button>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CalendarRangeIcon className="w-4 h-4 mr-2" />
                  View Payment Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Payment History
                </Button>
              </div>
            </Card>
          </div>

          {/* Standing Orders List */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Active Standing Orders</h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {mockStandingOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center">
                          <RepeatIcon className="w-4 h-4 mr-2" />
                          <h3 className="font-medium">{order.recipientName}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{order.description}</p>
                        <p className="text-sm text-gray-500">
                          Next payment: {new Date(order.nextPayment).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">{getFrequencyText(order.frequency)}</p>
                      </div>
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <p className="text-xl font-semibold">€{order.amount.toFixed(2)}</p>
                        <span className={`text-sm ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            {order.status === 'active' ? 'Pause' : 'Resume'}
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2Icon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {mockStandingOrders.some(order => 
                new Date(order.nextPayment) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ) && (
                <Alert className="mt-6">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    You have standing orders due in the next 7 days. Please ensure sufficient funds are available.
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