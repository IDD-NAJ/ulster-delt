'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface AccountOption {
  id: string;
  type: string;
  accountNumber: string;
}

export default function SendMoneyModal({ open, onOpenChange, accounts }: { open: boolean, onOpenChange: (open: boolean) => void, accounts: AccountOption[] }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/transactions/send-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount, accountId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send money');
      setSuccess('Money sent successfully!');
      setRecipient('');
      setAmount('');
      setAccountId(accounts[0]?.id || '');
      setTimeout(() => {
        setSuccess('');
        onOpenChange(false);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">From Account</label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.type} (****{acc.accountNumber.slice(-4)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input placeholder="Recipient" value={recipient} onChange={e => setRecipient(e.target.value)} required />
          <Input placeholder="Amount" type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 