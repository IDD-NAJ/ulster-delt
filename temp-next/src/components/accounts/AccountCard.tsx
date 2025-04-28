'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Share2, Lock, ChevronRight } from "lucide-react";

interface Account {
  id: string;
  type: string;
  accountNumber: string;
  balance: number;
  transactions?: {
    createdAt: Date;
    amount: number;
    type: string;
    category?: string;
    status?: string;
    description?: string;
  }[];
}

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  const lastTransaction = account.transactions ? account.transactions[0] : undefined;
  const lastTransactionTime = lastTransaction 
    ? new Date(lastTransaction.createdAt).toLocaleTimeString()
    : 'No transactions';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 lg:p-6 pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg text-[#1B4332]">{account.type}</CardTitle>
            <CardDescription>Account ending in {account.accountNumber.slice(-4)}</CardDescription>
          </div>
          <Badge variant="default">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-[#1B4332]">
                £{account.balance.toLocaleString()}
              </span>
              <p className="text-sm text-muted-foreground">Available Balance</p>
            </div>
            <span className="text-sm text-muted-foreground">
              Last transaction: {lastTransactionTime}
            </span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <div className="px-4 pb-2">
        <h4 className="text-md font-semibold mb-2">Recent Transactions</h4>
        {account.transactions && account.transactions.length > 0 ? (
          <ul className="space-y-2">
            {account.transactions.slice(0, 3).map((tx, idx) => (
              <li key={idx} className="flex flex-col border-b last:border-b-0 pb-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={tx.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                    {tx.amount < 0 ? '-' : '+'}£{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>{tx.type}</span>
                  <span>{tx.category || 'General'}</span>
                  <span>{tx.status || 'Completed'}</span>
                </div>
                {tx.description && (
                  <div className="text-xs text-gray-600 mt-0.5">{tx.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent transactions</p>
        )}
        <div className="mt-2 flex justify-end">
          <Button variant="link" size="sm">View All Transactions</Button>
        </div>
      </div>
      <Separator />
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Transfer
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Lock className="h-4 w-4" />
            Lock Card
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
} 