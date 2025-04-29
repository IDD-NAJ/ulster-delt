'use client';

import { useState, useEffect } from 'react';
import { CardType, CardStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';

interface TransformedCard {
  id: string;
  lastFourDigits: string;
  expiryDate: Date;
  status: CardStatus;
  type: CardType;
}

interface CardsListProps {
  accountId?: string;
}

export function CardsList({ accountId }: CardsListProps) {
  const [cards, setCards] = useState<TransformedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [accountId]);

  const fetchCards = async () => {
    if (!accountId) {
      toast.error('Please select an account first');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/cards?accountId=${accountId}`);
      if (!response.ok) throw new Error('Failed to fetch cards');
      const data = await response.json();
      const transformedData = data.map((card: any) => ({
        ...card,
        expiryDate: new Date(card.expiryDate),
      }));
      setCards(transformedData);
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const requestCard = async () => {
    if (!accountId) {
      toast.error('Please select an account first');
      return;
    }

    try {
      setRequesting(true);
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          type: 'DEBIT',
        }),
      });

      if (!response.ok) throw new Error('Failed to request card');

      const newCard = await response.json();
      setCards(prev => [...prev, newCard]);
      toast.success('Card requested successfully');
    } catch (error) {
      console.error('Error requesting card:', error);
      toast.error('Failed to request card');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (cards.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Cards Found</h3>
        <p className="text-gray-600 mb-4">
          You haven't added any cards yet. Request your first card to get started.
        </p>
        <Button
          onClick={requestCard}
          disabled={requesting}
          className="w-full md:w-auto"
        >
          {requesting ? 'Requesting...' : 'Request Your First Card'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Cards</h2>
        <Button
          onClick={requestCard}
          disabled={requesting}
        >
          {requesting ? 'Requesting...' : 'Request New Card'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">
                  {card.type} Card
                </h3>
                <p className="text-sm text-gray-600">
                  **** **** **** {card.lastFourDigits}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                card.status === CardStatus.ACTIVE
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {card.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Expires: {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 