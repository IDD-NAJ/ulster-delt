'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Share2,
  Printer,
  Settings,
  Bell,
  FileText,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalyticsData {
  totalSpending: number;
  totalIncome: number;
  savingsRate: number;
  spendingByCategory: Record<string, number>;
  monthlySpending: Array<{
    createdAt: string;
    _sum: { amount: number };
  }>;
  accounts: Array<{
    id: string;
    type: string;
    balance: number;
    accountNumber: string;
  }>;
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [accountFilter, setAccountFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe, accountFilter]);

  // Transform spending by category data for display
  const spendingCategories = data ? Object.entries(data.spendingByCategory).map(([category, amount], index) => ({
        category,
    amount,
    percentage: (amount / data.totalSpending) * 100,
    trend: 'neutral' as const,
    color: `hsl(${index * 50}, 70%, 50%)`
  })) : [];

  // Transform monthly spending data for display
  const monthlySpendingData = data?.monthlySpending.map(item => ({
    month: new Date(item.createdAt).toLocaleString('default', { month: 'short' }),
    amount: item._sum.amount
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4332]" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-lg font-semibold">Error Loading Analytics</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Back to Dashboard */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10">
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10"
              onClick={() => console.log('Refresh data')}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden md:inline">Refresh</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10"
              onClick={() => console.log('Share analytics')}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden md:inline">Share</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10"
              onClick={() => console.log('Print report')}
            >
              <Printer className="h-4 w-4" />
              <span className="hidden md:inline">Print</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden sm:flex items-center gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden md:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Excel Spreadsheet
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  CSV Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Alerts</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center gap-2 text-[#1B4332] hover:text-[#1B4332] hover:bg-[#1B4332]/10"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </Button>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="sm:hidden"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#1B4332]">Financial Analytics</h1>
          <p className="text-muted-foreground">Track your spending and financial trends</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="checking">Main Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="business">Business Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Total Spending</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">£{data?.totalSpending.toLocaleString()}</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">This Month</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Total Income</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">£{data?.totalIncome.toLocaleString()}</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">This Month</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Savings Rate</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{data?.savingsRate.toFixed(1)}%</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">This Month</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Active Accounts</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{data?.accounts.length || 0}</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Active</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1B4332]">Spending by Category</CardTitle>
              <CardDescription>Your top spending categories this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span>£{category.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" style={{ backgroundColor: `${category.color}30` }}>
                      <div className="h-full" style={{ backgroundColor: category.color }} />
                    </Progress>
                    <span className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}% of total spending</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1B4332]">Monthly Overview</CardTitle>
              <CardDescription>Your spending trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2">
                {monthlySpendingData.map((month, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-12 bg-[#1B4332] rounded-t"
                      style={{ 
                        height: `${(month.amount / Math.max(...monthlySpendingData.map(m => m.amount))) * 200}px`,
                        opacity: 0.8 + (index * 0.03)
                      }}
                    />
                    <span className="text-sm text-muted-foreground">{month.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Spending Calendar</h3>
                <p className="text-sm text-muted-foreground">View daily spending patterns</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Budget Analysis</h3>
                <p className="text-sm text-muted-foreground">Compare budget vs actual</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Custom Reports</h3>
                <p className="text-sm text-muted-foreground">Generate detailed reports</p>
              </div>
            </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
} 