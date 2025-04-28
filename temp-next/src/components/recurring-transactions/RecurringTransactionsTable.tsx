import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditRecurringTransactionDialog } from "./EditRecurringTransactionDialog";
import { RecurringTransaction } from "@prisma/client";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { useRecurringTransactions } from "@/hooks/useRecurringTransactions";
import { DeleteRecurringTransactionDialog } from "./DeleteRecurringTransactionDialog";

interface RecurringTransactionsTableProps {
  recurringTransactions: RecurringTransaction[];
  onUpdate: () => void;
}

export function RecurringTransactionsTable({
  recurringTransactions,
  onUpdate,
}: RecurringTransactionsTableProps) {
  const { deleteRecurringTransaction } = useRecurringTransactions();
  const [editingTransaction, setEditingTransaction] =
    useState<RecurringTransaction | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteRecurringTransaction(id);
      onUpdate();
    } catch (error) {
      console.error("Error deleting recurring transaction:", error);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
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
              <TableCell>{formatCurrency(transaction.amount, transaction.currency)}</TableCell>
              <TableCell>{transaction.currency}</TableCell>
              <TableCell>{transaction.frequency}</TableCell>
              <TableCell>{new Date(transaction.startDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {transaction.endDate
                  ? new Date(transaction.endDate).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <EditRecurringTransactionDialog
                    transaction={transaction}
                    onUpdate={onUpdate}
                  />
                  <DeleteRecurringTransactionDialog
                    transaction={transaction}
                    onDelete={() => handleDelete(transaction.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingTransaction && (
        <EditRecurringTransactionDialog
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          recurringTransaction={editingTransaction}
          onSubmit={async (data) => {
            try {
              const response = await fetch(
                `/api/recurring-transactions/${editingTransaction.id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                }
              );

              if (response.ok) {
                onUpdate();
                setEditingTransaction(null);
              } else {
                console.error("Failed to update recurring transaction");
              }
            } catch (error) {
              console.error("Error updating recurring transaction:", error);
            }
          }}
        />
      )}
    </div>
  );
} 