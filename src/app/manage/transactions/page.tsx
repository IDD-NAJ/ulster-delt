"use client";

import { useState, useEffect } from "react";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { TransactionHistory } from "@/components/transactions/TransactionHistory";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { TransactionAnalytics } from "@/components/transactions/TransactionAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Download, Search, Trash2 } from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/export";
import { useDebounce } from "@/hooks/use-debounce";
import { ErrorBoundary } from '@/components/error-boundary';
import { useApi } from '@/hooks/use-api';
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Hero } from '@/components/ui/hero';
import { Plus, Edit2, Loader2 } from 'lucide-react';

// Initial mock data
const initialTransactions = [
  {
    id: "1",
    date: "2024-03-15",
    description: "Salary Payment",
    amount: 3500,
    type: "income",
    category: "Income",
    currency: "GBP"
  },
  {
    id: "2",
    date: "2024-03-14",
    description: "Grocery Shopping",
    amount: 85.50,
    type: "expense",
    category: "Food",
    currency: "GBP"
  },
  {
    id: "3",
    date: "2024-03-13",
    description: "Electric Bill",
    amount: 120,
    type: "expense",
    category: "Bills",
    currency: "GBP"
  },
  {
    id: "4",
    date: "2024-03-12",
    description: "Freelance Work",
    amount: 750,
    type: "income",
    category: "Income",
    currency: "GBP"
  },
  {
    id: "5",
    date: "2024-03-11",
    description: "Restaurant Dinner",
    amount: 65.80,
    type: "expense",
    category: "Food",
    currency: "GBP"
  }
];

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  currency: string;
}

function TransactionsSection() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    currency: 'GBP',
  });

  const { data: transactions, isLoading, error, refetch } = useApi<Transaction[]>('/api/transactions', {
    retryCount: 3,
    retryDelay: 1000,
    cacheTime: 5 * 60 * 1000,
  });

  const filteredTransactions = transactions?.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.amount.toString().includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = selectedTransaction 
        ? `/api/transactions?id=${selectedTransaction.id}`
        : '/api/transactions';
      
      const response = await fetch(url, {
        method: selectedTransaction ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) throw new Error('Failed to save transaction');

      toast.success(`Transaction ${selectedTransaction ? 'updated' : 'created'} successfully`);
      setIsDialogOpen(false);
      setSelectedTransaction(null);
      setFormData({
        date: '',
        description: '',
        amount: '',
        type: 'expense',
        categoryId: '',
        currency: 'GBP',
      });
      refetch();
    } catch (error) {
      toast.error('Failed to save transaction');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');

      toast.success('Transaction deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Currency'];
    const csvContent = [
      headers.join(','),
      ...(filteredTransactions || []).map(transaction => [
        transaction.date,
        transaction.description,
        transaction.amount,
        transaction.type,
        transaction.currency,
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold">Transactions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedTransaction(null);
                      setFormData({
                        date: '',
                        description: '',
                        amount: '',
                        type: 'expense',
                        categoryId: '',
                        currency: 'GBP',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedTransaction ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions?.map((transaction) => (
            <Card key={transaction.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setFormData({
                          date: transaction.date,
                          description: transaction.description,
                          amount: transaction.amount.toString(),
                          type: transaction.type,
                          categoryId: transaction.categoryId,
                          currency: transaction.currency,
                        });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ErrorBoundary>
      <div>
        <Hero
          title="Transaction Management"
          subtitle="Track and manage your financial transactions."
          imagePath="/images/hero-manage.jpg"
        />
        <div className="container mx-auto py-12">
          <TransactionsSection />
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Mock categories for the form
const mockCategories = [
  { id: "1", name: "Income" },
  { id: "2", name: "Food" },
  { id: "3", name: "Bills" },
  { id: "4", name: "Shopping" },
  { id: "5", name: "Transport" },
  { id: "6", name: "Entertainment" },
]; 