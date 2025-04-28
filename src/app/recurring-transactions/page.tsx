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
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recurring Transactions</h1>
      <div className="space-y-4">
        <Button
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Add Recurring Transaction"}
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