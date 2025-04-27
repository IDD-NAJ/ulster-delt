'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Hero } from '@/components/ui/hero';
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Tag,
} from 'lucide-react';

// Mock data for transactions
const mockTransactions = [
  {
    id: '1',
    date: '2024-02-20',
    description: 'Grocery Store',
    amount: -45.99,
    category: 'Shopping',
    type: 'debit',
    reference: 'POS-12345',
  },
  {
    id: '2',
    date: '2024-02-19',
    description: 'Salary Payment',
    amount: 2500.00,
    category: 'Income',
    type: 'credit',
    reference: 'SAL-78901',
  },
  // Add more mock transactions...
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const categories = [
    'all',
    'Shopping',
    'Income',
    'Bills',
    'Transport',
    'Entertainment',
    'Food',
  ];

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalIncome: mockTransactions.reduce((sum, t) => t.amount > 0 ? sum + t.amount : sum, 0),
    totalExpenses: Math.abs(mockTransactions.reduce((sum, t) => t.amount < 0 ? sum + t.amount : sum, 0)),
    totalTransactions: mockTransactions.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title="Transactions"
        subtitle="View and manage your transaction history"
        imagePath="/hero-transactions.jpg"
      />

      <div className="container mx-auto py-12 px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">£{stats.totalIncome.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">£{stats.totalExpenses.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
            <p className="text-2xl font-bold">{stats.totalTransactions}</p>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                items={categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))}
                placeholder="Category"
                className="w-[150px]"
              />
              <DateRangePicker
                value={selectedDateRange}
                onChange={setSelectedDateRange}
                placeholder="Select date range"
              />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <Card>
          <div className="p-6">
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowUpRight className={`h-5 w-5 ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      ) : (
                        <ArrowDownLeft className={`h-5 w-5 ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{transaction.date}</span>
                        <Tag className="h-4 w-4 ml-2" />
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}£{Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.reference}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 