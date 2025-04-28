"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowRightIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  HomeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

// Mock data
const transactionData = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Apr", income: 2780, expenses: 3908 },
  { month: "May", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
];

const accountGrowth = [
  { month: "Jan", users: 100 },
  { month: "Feb", users: 120 },
  { month: "Mar", users: 150 },
  { month: "Apr", users: 180 },
  { month: "May", users: 220 },
  { month: "Jun", users: 280 },
];

const stats = [
  {
    title: "Total Revenue",
    value: "₤52,000",
    change: "+12%",
    isPositive: true,
  },
  {
    title: "Active Users",
    value: "2,450",
    change: "+5%",
    isPositive: true,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    isPositive: false,
  },
  {
    title: "Average Transaction",
    value: "₤245",
    change: "+8%",
    isPositive: true,
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and analyze your business performance
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div
                  className={`flex items-center ${
                    stat.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowTrendingUpIcon className="h-5 w-5" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-5 w-5" />
                  )}
                  <span className="ml-1 text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-6">Transaction Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Account Growth Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-6">Account Growth</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accountGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#3B82F6" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
          <div className="flex justify-around items-center h-16 px-4">
            <Button variant="ghost" className="flex flex-col items-center py-1">
              <HomeIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Overview</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center py-1">
              <BanknotesIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Accounts</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center py-1">
              <CreditCardIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Cards</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center py-1">
              <ArrowsRightLeftIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Transfers</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center py-1">
              <ChartBarIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Analytics</span>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 