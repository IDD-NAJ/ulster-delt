import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { RecurringTransaction } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CreateRecurringTransactionDialog } from "./CreateRecurringTransactionDialog";
import { format } from "date-fns";

export function RecurringTransactionList() {
  const { data: session } = useSession();
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const fetchRecurringTransactions = async () => {
    try {
      const url = selectedAccount
        ? `/api/recurring-transactions?accountId=${selectedAccount}`
        : "/api/recurring-transactions";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch recurring transactions");
      const data = await response.json();
      setRecurringTransactions(data);
    } catch (error) {
      console.error("Error fetching recurring transactions:", error);
    }
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, [selectedAccount]);

  const handleCreateRecurringTransaction = async (data: any) => {
    try {
      const response = await fetch("/api/recurring-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create recurring transaction");
      
      await fetchRecurringTransactions();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating recurring transaction:", error);
    }
  };

  const handleDeleteRecurringTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete recurring transaction");
      
      await fetchRecurringTransactions();
    } catch (error) {
      console.error("Error deleting recurring transaction:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recurring Transactions</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Recurring Transaction
        </Button>
      </div>

      <div className="grid gap-4">
        {recurringTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{transaction.description}</CardTitle>
                  <CardDescription>
                    {format(new Date(transaction.startDate), "PPP")} -{" "}
                    {transaction.endDate
                      ? format(new Date(transaction.endDate), "PPP")
                      : "No end date"}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <CardTitle
                    className={
                      transaction.type === "CREDIT"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {transaction.type === "CREDIT" ? "+" : "-"}
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </CardTitle>
                  <CardDescription>
                    {transaction.frequency} - Next:{" "}
                    {format(new Date(transaction.nextOccurrence), "PPP")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {transaction.categoryId && (
                    <div>Category: {transaction.categoryId}</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteRecurringTransaction(transaction.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateRecurringTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRecurringTransaction}
        selectedAccount={selectedAccount}
      />
    </div>
  );
} 