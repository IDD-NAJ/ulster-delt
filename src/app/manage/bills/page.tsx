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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Calendar, Clock, Filter, Download, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  category: string;
  paymentMethod: string;
};

const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Electricity Bill',
    amount: 85.50,
    dueDate: '2024-04-15',
    status: 'pending',
    category: 'Utilities',
    paymentMethod: 'Direct Debit'
  },
  {
    id: '2',
    name: 'Internet Service',
    amount: 49.99,
    dueDate: '2024-04-20',
    status: 'paid',
    category: 'Internet',
    paymentMethod: 'Credit Card'
  },
  {
    id: '3',
    name: 'Water Bill',
    amount: 45.00,
    dueDate: '2024-04-01',
    status: 'overdue',
    category: 'Utilities',
    paymentMethod: 'Bank Transfer'
  }
];

const mockHistory = [
  {
    id: '1',
    name: 'Electricity Bill',
    amount: 82.30,
    date: '2024-03-15',
    status: 'completed',
    reference: 'ELEC-MAR24'
  },
  {
    id: '2',
    name: 'Internet Service',
    amount: 49.99,
    date: '2024-03-20',
    status: 'completed',
    reference: 'INT-MAR24'
  }
];

export default function BillsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredBills = mockBills.filter(bill => {
    const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || bill.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bills Management</h1>
          <p className="text-xl text-gray-600">Manage and track all your bills in one place</p>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="current">Current Bills</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {/* Filters and Search */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Search Bills</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Search by name..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Internet">Internet</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Bills List */}
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <Card key={bill.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{bill.name}</h3>
                      <p className="text-sm text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{bill.paymentMethod}</p>
                    </div>
                    <div className="flex flex-col items-end mt-4 md:mt-0">
                      <p className="text-xl font-semibold">€{bill.amount.toFixed(2)}</p>
                      <span className={`text-sm px-2 py-1 rounded-full mt-2 ${getStatusColor(bill.status)}`}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1">Pay Now</Button>
                    <Button variant="outline" className="flex-1">Schedule Payment</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Payment History</h2>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-4">
                {mockHistory.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-4 border-b">
                    <div>
                      <h3 className="font-medium">{payment.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">Ref: {payment.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{payment.amount.toFixed(2)}</p>
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span>Schedule Payments</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Receipt className="h-6 w-6 mb-2" />
            <span>View Statements</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Clock className="h-6 w-6 mb-2" />
            <span>Set Reminders</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 