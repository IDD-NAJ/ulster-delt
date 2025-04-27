import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TransactionStatus, TransactionType } from '@prisma/client';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  status: TransactionStatus;
  createdAt: Date;
  account: {
    name: string;
    number: string;
  };
  category?: {
    name: string;
    color: string;
  };
  recurringTransaction?: {
    frequency: string;
    nextDue: Date;
  };
}

interface TransactionDetailsProps {
  transaction: Transaction;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="font-medium">{transaction.type}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge
                variant={
                  transaction.status === 'COMPLETED'
                    ? 'default'
                    : transaction.status === 'PENDING'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {transaction.status}
              </Badge>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Amount</div>
            <div
              className={`text-2xl font-bold ${
                transaction.type === 'CREDIT'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {transaction.type === 'CREDIT' ? '+' : '-'}
              {formatCurrency(transaction.amount, transaction.currency)}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="font-medium">{transaction.description}</div>
          </div>

          {transaction.reference && (
            <div>
              <div className="text-sm text-muted-foreground">Reference</div>
              <div className="font-medium">{transaction.reference}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">
                {format(transaction.createdAt, 'PPP')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-medium">
                {format(transaction.createdAt, 'p')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Account Name</div>
            <div className="font-medium">{transaction.account.name}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Account Number</div>
            <div className="font-medium">{transaction.account.number}</div>
          </div>
        </CardContent>
      </Card>

      {transaction.category && (
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              style={{
                backgroundColor: transaction.category.color,
                color: 'white',
              }}
            >
              {transaction.category.name}
            </Badge>
          </CardContent>
        </Card>
      )}

      {transaction.recurringTransaction && (
        <Card>
          <CardHeader>
            <CardTitle>Recurring Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Frequency</div>
              <div className="font-medium">
                {transaction.recurringTransaction.frequency}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Next Due</div>
              <div className="font-medium">
                {format(transaction.recurringTransaction.nextDue, 'PPP')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 