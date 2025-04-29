"use client";

import { Metadata } from "next";
import { RecurringTransactionsList } from "@/components/recurring-transactions/RecurringTransactionsList";
import { AddRecurringTransactionDialog } from "@/components/recurring-transactions/AddRecurringTransactionDialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useState } from "react";

const RecurringTransactionsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Recurring Transactions"
        description="Manage your recurring transactions"
      >
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add Recurring Transaction
        </Button>
      </PageHeader>

      <RecurringTransactionsList />

      <AddRecurringTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};

export default RecurringTransactionsPage; 