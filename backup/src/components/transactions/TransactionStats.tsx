"use client"

import { Card } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

interface TransactionStatsProps {
  totalIncome: number
  totalExpenses: number
  netBalance: number
}

export function TransactionStats({
  totalIncome,
  totalExpenses,
  netBalance,
}: TransactionStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Total Income</p>
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        </div>
        <p className="mt-2 text-2xl font-bold text-green-500">
          {formatCurrency(totalIncome)}
        </p>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Total Expenses</p>
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        </div>
        <p className="mt-2 text-2xl font-bold text-red-500">
          {formatCurrency(totalExpenses)}
        </p>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Net Balance</p>
          <MinusIcon className={`h-4 w-4 ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <p className={`mt-2 text-2xl font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(netBalance)}
        </p>
      </Card>
    </div>
  )
} 