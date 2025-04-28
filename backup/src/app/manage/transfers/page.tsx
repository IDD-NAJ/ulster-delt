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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Star,
  Search,
  Download,
  Filter,
  Clock,
  Trash2,
  Edit,
  Copy,
  Plus
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Transfer = {
  id: string;
  type: 'sent' | 'received';
  recipient: string;
  accountNumber: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  category?: string;
};

type ScheduledTransfer = {
  id: string;
  recipient: string;
  accountNumber: string;
  amount: number;
  scheduledDate: string;
  reference: string;
  recurring: boolean;
};

type TransferTemplate = {
  id: string;
  name: string;
  recipient: string;
  accountNumber: string;
  amount: number;
  reference: string;
  category: string;
  lastUsed: string;
};

const mockTransfers: Transfer[] = [
  {
    id: '1',
    type: 'sent',
    recipient: 'John Smith',
    accountNumber: 'IE29AIBK93115212345678',
    amount: 500.00,
    date: '2024-04-10T14:30:00',
    status: 'completed',
    reference: 'Rent payment',
    category: 'Housing'
  },
  {
    id: '2',
    type: 'received',
    recipient: 'Sarah Johnson',
    accountNumber: 'IE29AIBK93115287654321',
    amount: 75.50,
    date: '2024-04-09T11:20:00',
    status: 'completed',
    reference: 'Shared bills',
    category: 'Utilities'
  },
  {
    id: '3',
    type: 'sent',
    recipient: 'Dublin Fitness',
    accountNumber: 'IE29AIBK93115298765432',
    amount: 45.00,
    date: '2024-04-08T09:15:00',
    status: 'failed',
    reference: 'Gym membership',
    category: 'Health'
  }
];

const mockScheduledTransfers: ScheduledTransfer[] = [
  {
    id: '1',
    recipient: 'John Smith',
    accountNumber: 'IE29AIBK93115212345678',
    amount: 500.00,
    scheduledDate: '2024-05-01',
    reference: 'Rent payment',
    recurring: true
  },
  {
    id: '2',
    recipient: 'Car Insurance Co',
    accountNumber: 'IE29AIBK93115265432198',
    amount: 85.00,
    scheduledDate: '2024-04-15',
    reference: 'Car insurance',
    recurring: false
  }
];

const mockTemplates: TransferTemplate[] = [
  {
    id: '1',
    name: 'Monthly Rent',
    recipient: 'John Smith',
    accountNumber: 'IE29AIBK93115212345678',
    amount: 500.00,
    reference: 'Rent payment',
    category: 'Housing',
    lastUsed: '2024-04-01'
  },
  {
    id: '2',
    name: 'Gym Membership',
    recipient: 'Dublin Fitness',
    accountNumber: 'IE29AIBK93115298765432',
    amount: 45.00,
    reference: 'Monthly membership',
    category: 'Health',
    lastUsed: '2024-03-15'
  }
];

export default function TransfersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const filteredTransfers = mockTransfers.filter(transfer => {
    const matchesSearch = 
      transfer.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    if (dateFilter === 'today') {
      const isToday = new Date(transfer.date).toDateString() === new Date().toDateString();
      return matchesSearch && matchesStatus && isToday;
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Transfer Management</h1>
          <p className="text-xl text-gray-600">View and manage your transfers</p>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card className="p-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search transfers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transfer History Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>
                        {new Date(transfer.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transfer.type === 'sent' ? 
                            <ArrowUpRight className="w-4 h-4 mr-2 text-red-500" /> :
                            <ArrowDownLeft className="w-4 h-4 mr-2 text-green-500" />
                          }
                          <div>
                            <div>{transfer.recipient}</div>
                            <div className="text-sm text-gray-500">{transfer.accountNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{transfer.reference}</TableCell>
                      <TableCell className={transfer.type === 'sent' ? 'text-red-600' : 'text-green-600'}>
                        {transfer.type === 'sent' ? '-' : '+'}€{transfer.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`${getStatusColor(transfer.status)}`}>
                          {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end mt-4">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export History
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Scheduled Transfers</h2>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Transfer
                </Button>
              </div>

              <div className="space-y-4">
                {mockScheduledTransfers.map((transfer) => (
                  <Card key={transfer.id} className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <h3 className="font-medium">{transfer.recipient}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{transfer.reference}</p>
                        <p className="text-sm text-gray-500">
                          Scheduled for: {new Date(transfer.scheduledDate).toLocaleDateString()}
                        </p>
                        {transfer.recurring && (
                          <span className="text-sm text-blue-600">Recurring Transfer</span>
                        )}
                      </div>
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <p className="text-xl font-semibold">€{transfer.amount.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Transfer Templates</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="space-y-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          <h3 className="font-medium">{template.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{template.recipient}</p>
                        <p className="text-sm text-gray-500">{template.reference}</p>
                        <p className="text-sm text-gray-500">
                          Last used: {new Date(template.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <p className="text-xl font-semibold">€{template.amount.toFixed(2)}</p>
                        <span className="text-sm text-gray-500">{template.category}</span>
                        <div className="flex gap-2 mt-2">
                          <Button>Use Template</Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 