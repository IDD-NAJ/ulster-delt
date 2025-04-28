import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Transaction } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CreateTransactionDialog } from "./CreateTransactionDialog";
import { format } from "date-fns";

export function TransactionList() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const url = selectedAccount
        ? `/api/transactions?accountId=${selectedAccount}`
        : "/api/transactions";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedAccount]);

  const handleCreateTransaction = async (data: any) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create transaction");
      
      await fetchTransactions();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");
      
      await fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="grid gap-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{transaction.description}</CardTitle>
                  <CardDescription>
                    {format(new Date(transaction.createdAt), "PPP")}
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
                  <CardDescription>{transaction.status}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {transaction.reference && (
                    <div>Reference: {transaction.reference}</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTransaction}
        selectedAccount={selectedAccount}
      />
    </div>
  );
} 