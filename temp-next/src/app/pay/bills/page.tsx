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
  Lightbulb,
  Droplets,
  Wifi,
  Phone,
  Home,
  Plus,
  Search,
  Clock,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Bill = {
  id: string;
  provider: string;
  type: 'electricity' | 'water' | 'internet' | 'phone' | 'rent';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  accountNumber: string;
};

const mockBills: Bill[] = [
  {
    id: '1',
    provider: 'PowerCo Energy',
    type: 'electricity',
    amount: 89.50,
    dueDate: '2024-04-15',
    status: 'pending',
    accountNumber: 'EL-123456'
  },
  {
    id: '2',
    provider: 'CityWater',
    type: 'water',
    amount: 45.20,
    dueDate: '2024-04-10',
    status: 'paid',
    accountNumber: 'WA-789012'
  },
  {
    id: '3',
    provider: 'FastNet',
    type: 'internet',
    amount: 59.99,
    dueDate: '2024-04-05',
    status: 'overdue',
    accountNumber: 'IN-345678'
  }
];

const providers = {
  electricity: ['PowerCo Energy', 'GreenEnergy', 'ElectricityPlus'],
  water: ['CityWater', 'AquaFlow', 'WaterWorks'],
  internet: ['FastNet', 'SpeedyNet', 'ConnectAll'],
  phone: ['MobileOne', 'TelePlus', 'PhoneCo'],
  rent: ['PropertyManage', 'RentEasy', 'HomeRental']
};

export default function BillsPage() {
  const [selectedBillType, setSelectedBillType] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const getBillIcon = (type: string) => {
    switch (type) {
      case 'electricity':
        return <Lightbulb className="w-5 h-5" />;
      case 'water':
        return <Droplets className="w-5 h-5" />;
      case 'internet':
        return <Wifi className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'rent':
        return <Home className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bills & Utilities</h1>
          <p className="text-xl text-gray-600">Manage and pay your bills in one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pay Bill Form */}
          <div className="md:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Pay a Bill</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bill Type</Label>
                  <Select
                    value={selectedBillType}
                    onValueChange={setSelectedBillType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bill type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select
                    value={selectedProvider}
                    onValueChange={setSelectedProvider}
                    disabled={!selectedBillType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedBillType &&
                        providers[selectedBillType as keyof typeof providers].map(
                          (provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    placeholder="Enter account number"
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

                <Button className="w-full" disabled={!selectedBillType || !selectedProvider || !accountNumber || !amount}>
                  Pay Bill
                </Button>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Biller
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Find a Bill
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Payment History
                </Button>
              </div>
            </Card>
          </div>

          {/* Bills List */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Bills</h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bills</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Account No.</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getBillIcon(bill.type)}
                          <span className="ml-2">{bill.provider}</span>
                        </div>
                      </TableCell>
                      <TableCell>{bill.accountNumber}</TableCell>
                      <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>€{bill.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={getStatusColor(bill.status)}>
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={bill.status === 'paid'}
                        >
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {mockBills.some(bill => bill.status === 'overdue') && (
                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have overdue bills. Please pay them as soon as possible to avoid late fees.
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