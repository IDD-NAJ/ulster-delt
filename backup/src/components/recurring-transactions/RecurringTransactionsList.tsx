import { useRecurringTransactions } from "@/hooks/useRecurringTransactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { EditRecurringTransactionDialog } from "./EditRecurringTransactionDialog";
import { useState } from "react";

export function RecurringTransactionsList() {
  const { recurringTransactions, isLoading, deleteRecurringTransaction } =
    useRecurringTransactions();
  const [editingTransaction, setEditingTransaction] = useState<string | null>(
    null
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recurringTransactions?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recurring transactions found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recurringTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>
                {formatCurrency(transaction.amount, transaction.currency)}
              </TableCell>
              <TableCell>{transaction.frequency}</TableCell>
              <TableCell>
                {format(new Date(transaction.startDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {transaction.endDate
                  ? format(new Date(transaction.endDate), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTransaction(transaction.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      deleteRecurringTransaction.mutate(transaction.id)
                    }
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingTransaction && (
        <EditRecurringTransactionDialog
          transactionId={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          onSubmit={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
} 