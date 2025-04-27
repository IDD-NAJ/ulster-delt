import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RecurringTransaction } from "@prisma/client";

interface DeleteRecurringTransactionDialogProps {
  transaction: RecurringTransaction;
  onDelete: () => void;
}

export function DeleteRecurringTransactionDialog({
  transaction,
  onDelete,
}: DeleteRecurringTransactionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Recurring Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this recurring transaction? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onDelete()}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onDelete()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 