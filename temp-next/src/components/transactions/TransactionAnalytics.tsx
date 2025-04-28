"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  category: {
    name: string;
    color: string;
  };
}

interface TransactionAnalyticsProps {
  transactions: Transaction[];
}

export function TransactionAnalytics({ transactions }: TransactionAnalyticsProps) {
  // Prepare data for category distribution
  const categoryData = transactions.reduce((acc: any[], transaction) => {
    const existingCategory = acc.find(
      (item) => item.name === transaction.category.name
    );
    if (existingCategory) {
      existingCategory.amount += Math.abs(transaction.amount);
    } else {
      acc.push({
        name: transaction.category.name,
        amount: Math.abs(transaction.amount),
        color: transaction.category.color,
      });
    }
    return acc;
  }, []);

  // Prepare data for monthly trends
  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString("default", { month: "short" });
    const existingMonth = acc.find((item) => item.month === month);
    
    const amount = transaction.type === "CREDIT" ? transaction.amount : -transaction.amount;

    if (existingMonth) {
      existingMonth.income += transaction.type === "CREDIT" ? transaction.amount : 0;
      existingMonth.expense += transaction.type === "DEBIT" ? transaction.amount : 0;
      existingMonth.net += amount;
    } else {
      acc.push({
        month,
        income: transaction.type === "CREDIT" ? transaction.amount : 0,
        expense: transaction.type === "DEBIT" ? transaction.amount : 0,
        net: amount,
      });
    }
    return acc;
  }, []).sort((a, b) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  // Calculate spending by day of week
  const weeklyData = transactions.reduce((acc: any[], transaction) => {
    const date = new Date(transaction.date);
    const day = date.toLocaleString("default", { weekday: "short" });
    const existingDay = acc.find((item) => item.day === day);

    if (existingDay) {
      existingDay.amount += Math.abs(transaction.amount);
    } else {
      acc.push({
        day,
        amount: Math.abs(transaction.amount),
      });
    }
    return acc;
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Income vs Expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `£${value}`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  name="Expense"
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#6366f1"
                  name="Net"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Pattern</CardTitle>
          <CardDescription>Transaction volume by day of week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `£${value}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 