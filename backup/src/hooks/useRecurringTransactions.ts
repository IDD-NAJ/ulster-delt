import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RecurringTransaction } from "@prisma/client";

interface CreateRecurringTransactionData {
  description: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  currency: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
  endDate?: string;
}

interface UpdateRecurringTransactionData {
  id: string;
  data: Partial<CreateRecurringTransactionData>;
}

export function useRecurringTransactions() {
  const queryClient = useQueryClient();

  const { data: recurringTransactions, isLoading } = useQuery<RecurringTransaction[]>({
    queryKey: ["recurringTransactions"],
    queryFn: async () => {
      const response = await fetch("/api/recurring-transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch recurring transactions");
      }
      return response.json();
    },
  });

  const createRecurringTransaction = useMutation({
    mutationFn: async (data: CreateRecurringTransactionData) => {
      const response = await fetch("/api/recurring-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create recurring transaction");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
    },
  });

  const updateRecurringTransaction = useMutation({
    mutationFn: async ({ id, data }: UpdateRecurringTransactionData) => {
      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update recurring transaction");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
    },
  });

  const deleteRecurringTransaction = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete recurring transaction");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
    },
  });

  return {
    recurringTransactions,
    isLoading,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
  };
} 