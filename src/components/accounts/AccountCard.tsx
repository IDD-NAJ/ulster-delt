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
  transactions: {
    createdAt: Date;
    amount: number;
    type: string;
  }[];
}

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  const lastTransaction = account.transactions[0];
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