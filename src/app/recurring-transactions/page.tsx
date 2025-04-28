"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createRecurringTransaction } from "./actions";
import { toast } from "sonner";

export default function RecurringTransactionsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTransaction = async () => {
    try {
      setIsLoading(true);
      const result = await createRecurringTransaction({
        amount: 100,
        description: "Test recurring transaction",
        frequency: "MONTHLY",
        startDate: new Date(),
      });

      if (result.success) {
        toast.success("Recurring transaction created successfully");
      } else {
        toast.error(result.error || "Failed to create recurring transaction");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recurring Transactions</h1>
      <div className="space-y-4">
        <Button
          onClick={handleCreateTransaction}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Add Recurring Transaction"}
        </Button>
      </div>
    </div>
  );
} 