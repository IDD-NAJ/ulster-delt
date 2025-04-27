'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OpenAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountCreated: () => void;
}

export default function OpenAccountModal({ open, onOpenChange, onAccountCreated }: OpenAccountModalProps) {
  const [type, setType] = useState('CHECKING');
  const [name, setName] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, initialDeposit: parseFloat(initialDeposit) })
      });
      if (!res.ok) throw new Error('Failed to create account');
      onAccountCreated();
      onOpenChange(false);
      setType('CHECKING');
      setName('');
      setInitialDeposit('');
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
          <DialogTitle>Open New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Account Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHECKING">Current Account</SelectItem>
                <SelectItem value="SAVINGS">Savings Account</SelectItem>
                <SelectItem value="BUSINESS">Business Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Account Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Main Checking" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Initial Deposit (£)</label>
            <Input type="number" min="0" value={initialDeposit} onChange={e => setInitialDeposit(e.target.value)} required placeholder="0.00" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Opening...' : 'Open Account'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 