'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AccountOverviewPage() {
  const accounts = [
    {
      type: "Current Account",
      number: "**** 1234",
      balance: "£2,547.63",
      available: "£2,547.63",
      trend: "+£156.42",
      isPositive: true,
    },
    {
      type: "Savings Account",
      number: "**** 5678",
      balance: "£15,832.90",
      available: "£15,832.90",
      trend: "+£832.50",
      isPositive: true,
    },
    {
      type: "Credit Card",
      number: "**** 9012",
      balance: "£523.45",
      available: "£4,476.55",
      trend: "-£523.45",
      isPositive: false,
      limit: "£5,000.00",
    },
  ];

  const recentTransactions = [
    {
      date: "2024-03-15",
      description: "Amazon.co.uk",
      amount: "-£34.99",
      category: "Shopping",
      icon: "🛍️",
    },
    {
      date: "2024-03-14",
      description: "Salary - Tech Corp",
      amount: "+£3,250.00",
      category: "Income",
      icon: "💰",
    },
    {
      date: "2024-03-14",
      description: "Tesco",
      amount: "-£45.67",
      category: "Groceries",
      icon: "🛒",
    },
    {
      date: "2024-03-13",
      description: "Netflix",
      amount: "-£9.99",
      category: "Entertainment",
      icon: "🎬",
    },
    {
      date: "2024-03-12",
      description: "Transport for London",
      amount: "-£6.80",
      category: "Transport",
      icon: "🚇",
    },
  ];

  const insights = [
    {
      title: "Monthly Summary",
      value: "£2,450.32",
      description: "Total spending this month",
      trend: "-12%",
      isPositive: true,
    },
    {
      title: "Upcoming Bills",
      value: "£350.00",
      description: "Due in next 7 days",
      count: "3",
      isAlert: true,
    },
    {
      title: "Savings Goal",
      value: "75%",
      description: "Holiday fund progress",
      target: "£2,000",
      current: "£1,500",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Account Overview</h1>
        <Button asChild>
          <Link href="/manage/transfers/new">New Transfer</Link>
        </Button>
      </div>

      {/* Accounts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {accounts.map((account, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{account.type}</h3>
                <p className="text-sm text-gray-600">{account.number}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/manage/accounts/${index}`}>Details</Link>
              </Button>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold">{account.balance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-lg">{account.available}</p>
              </div>
              {account.limit && (
                <div>
                  <p className="text-sm text-gray-600">Credit Limit</p>
                  <p className="text-lg">{account.limit}</p>
                </div>
              )}
              <p className={`text-sm ${account.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {account.trend} this month
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6">
            <h3 className="font-semibold mb-2">{insight.title}</h3>
            <p className="text-2xl font-bold mb-1">{insight.value}</p>
            <p className="text-sm text-gray-600">{insight.description}</p>
            {insight.trend && (
              <p className={`text-sm ${insight.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {insight.trend} vs last month
              </p>
            )}
            {insight.target && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: insight.value }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {insight.current} of {insight.target}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Transactions</h2>
          <Button variant="outline" asChild>
            <Link href="/manage/transactions">View All</Link>
          </Button>
        </div>
        <Card>
          <div className="divide-y">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{transaction.icon}</span>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                </div>
                <p className={`font-medium ${
                  transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-primary/5">
          <h3 className="font-semibold mb-4">Statements</h3>
          <p className="text-gray-600 mb-4">Download or view your account statements</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/manage/statements">View Statements</Link>
          </Button>
        </Card>
        <Card className="p-6 bg-blue-500/5">
          <h3 className="font-semibold mb-4">Account Settings</h3>
          <p className="text-gray-600 mb-4">Manage your account preferences and security</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/manage/settings">Account Settings</Link>
          </Button>
        </Card>
        <Card className="p-6 bg-green-500/5">
          <h3 className="font-semibold mb-4">Support</h3>
          <p className="text-gray-600 mb-4">Get help with your account or contact support</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/help">Get Help</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
} 