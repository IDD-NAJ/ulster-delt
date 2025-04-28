import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecurringTransactionsTable } from "@/components/recurring-transactions/RecurringTransactionsTable";
import { AddRecurringTransactionDialog } from "@/components/recurring-transactions/AddRecurringTransactionDialog";
import { useRecurringTransactions } from "@/hooks/useRecurringTransactions";
import { PageHeader } from "@/components/ui/page-header";

export function RecurringTransactionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { recurringTransactions, isLoading, error } = useRecurringTransactions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Recurring Transactions"
        description="Manage your recurring transactions"
      >
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Recurring Transaction</Button>
      </PageHeader>

      <div className="mt-6">
        <RecurringTransactionsTable
          recurringTransactions={recurringTransactions || []}
          onUpdate={() => {}}
        />
      </div>

      <AddRecurringTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={() => {}}
      />
    </div>
  );
} 