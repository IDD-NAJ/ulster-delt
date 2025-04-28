import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TransactionType } from "@prisma/client";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: Date;
  status: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {transaction.user.firstName[0]}
                    {transaction.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-medium ${
                  transaction.type === TransactionType.CREDIT 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === TransactionType.CREDIT ? '+' : '-'}
                  £{transaction.amount.toLocaleString()}
                </span>
                <Badge 
                  variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {transaction.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 