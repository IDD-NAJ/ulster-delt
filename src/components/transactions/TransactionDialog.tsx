"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransactionForm } from "@/components/transactions/TransactionForm";

// Mock data for demonstration
const mockAccounts = [
  { id: "1", name: "Main Account", currency: "GBP" },
  { id: "2", name: "Savings Account", currency: "GBP" },
];

const mockCategories = [
  { id: "1", name: "Income" },
  { id: "2", name: "Food" },
  { id: "3", name: "Bills" },
  { id: "4", name: "Shopping" },
  { id: "5", name: "Transport" },
  { id: "6", name: "Entertainment" },
];

interface TransactionDialogProps {
  mode: "create" | "edit";
  initialData?: any;
  onSubmit: (data: any) => void;
  trigger?: React.ReactNode;
}

export function TransactionDialog({
  mode,
  initialData,
  onSubmit,
  trigger
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Transaction" : "Edit Transaction"}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          accounts={mockAccounts}
          categories={mockCategories}
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
} 