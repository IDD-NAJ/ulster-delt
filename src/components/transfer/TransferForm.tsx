'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Account } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

interface TransferFormProps {
  accounts: Account[];
}

export default function TransferForm({ accounts }: TransferFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    reference: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Transfer failed');
      }

      router.refresh();
      router.push('/dashboard');
    } catch (error) {
      console.error('Transfer error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fromAccount">From Account</Label>
          <Select
            value={formData.fromAccount}
            onValueChange={(value) =>
              setFormData({ ...formData, fromAccount: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.type} - {formatCurrency(account.balance)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="toAccount">To Account</Label>
          <Input
            id="toAccount"
            type="text"
            placeholder="Enter account number"
            value={formData.toAccount}
            onChange={(e) =>
              setFormData({ ...formData, toAccount: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            type="text"
            placeholder="Add a reference"
            value={formData.reference}
            onChange={(e) =>
              setFormData({ ...formData, reference: e.target.value })
            }
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Processing...' : 'Transfer Money'}
      </Button>
    </form>
  );
} 