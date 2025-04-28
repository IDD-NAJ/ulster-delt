"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

interface Account {
  id: string;
  number: string;
  type: string;
  balance: number;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  accounts: Account[];
  transactions: any[];
}

interface CardType {
  id: string;
  cardNumber: string;
  expiryDate: string;
  type: 'DEBIT' | 'CREDIT';
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
}

// Mock user and transaction data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER',
    status: 'Active',
    balance: 1200.5,
    cards: [
      { id: 'c1', number: '**** **** **** 1234', type: 'Visa', status: 'Active' },
    ],
    transactions: [
      { id: 't1', type: 'Deposit', amount: 500, date: '2024-05-01' },
      { id: 't2', type: 'Withdrawal', amount: 100, date: '2024-05-02' },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'USER',
    status: 'Active',
    balance: 500.0,
    cards: [],
    transactions: [],
  },
];

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CardType[]>([]);
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);
  const [newCardForm, setNewCardForm] = useState({
    type: 'DEBIT' as const,
  });

  useEffect(() => {
    if (params?.id) {
      fetchUserDetails();
      fetchUserCards();
    }
  }, [params?.id]);

  const fetchUserDetails = async () => {
    if (!params?.id) return;
    try {
      const res = await fetch(`/api/admin/users/${params.id}`);
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCards = async () => {
    if (!params?.id) return;
    try {
      const res = await fetch(`/api/admin/cards?userId=${params.id}`);
      if (res.ok) {
        const cardsData = await res.json();
        setCards(cardsData);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleAddCard = async () => {
    if (!params?.id) return;
    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: params.id,
          type: newCardForm.type,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to add card');
      }

      await fetchUserCards();
      setAddCardDialogOpen(false);
      setNewCardForm({ type: 'DEBIT' });
      alert('Card added successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add card';
      alert(message);
    }
  };

  const handleToggleCardStatus = async (cardId: string, currentStatus: string) => {
    if (!confirm(`Are you sure you want to ${currentStatus === 'ACTIVE' ? 'block' : 'unblock'} this card?`)) {
      return;
    }

    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      const res = await fetch('/api/admin/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, status: newStatus }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to update card status');
      }

      await fetchUserCards();
      alert(`Card ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update card status';
      alert(message);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">User not found</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Cards</h2>
        <div className="space-y-4">
          <Button onClick={() => setAddCardDialogOpen(true)}>Add New Card</Button>

          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <div key={card.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">**** **** **** {card.cardNumber?.slice(-4) || 'XXXX'}</p>
                    <p className="text-sm text-gray-500">
                      Expires: {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    card.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : card.status === 'BLOCKED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {card.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Type:</span> {card.type}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={card.status === 'ACTIVE' ? 'destructive' : 'default'}
                  onClick={() => handleToggleCardStatus(card.id, card.status)}
                >
                  {card.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={addCardDialogOpen} onOpenChange={setAddCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>
              Create a new card for {user.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Type</label>
              <select
                className="w-full border rounded-md p-2"
                value={newCardForm.type}
                onChange={(e) => setNewCardForm(prev => ({ ...prev, type: e.target.value as 'DEBIT' | 'CREDIT' }))}
              >
                <option value="DEBIT">Debit Card</option>
                <option value="CREDIT">Credit Card</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddCardDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCard}>
                Add Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 