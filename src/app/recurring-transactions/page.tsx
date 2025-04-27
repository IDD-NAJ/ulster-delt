"use client";

import { Metadata } from "next";
import { RecurringTransactionsList } from "@/components/recurring-transactions/RecurringTransactionsList";
import { AddRecurringTransactionDialog } from "@/components/recurring-transactions/AddRecurringTransactionDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Recurring Transactions | Ulster Delt",
  description: "Manage your recurring transactions",
};

export default function RecurringTransactionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recurring Transactions</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add Recurring Transaction
        </Button>
      </div>

      <RecurringTransactionsList />

      <AddRecurringTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
} 