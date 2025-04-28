"use client";
import { Transaction } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="mt-6">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-gray-500">No recent transactions</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className={transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'CREDIT' ? '+' : '-'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
} 