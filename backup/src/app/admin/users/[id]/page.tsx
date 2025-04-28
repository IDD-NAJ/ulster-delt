"use client";

import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

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

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const user = mockUsers.find(u => u.id === params.id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">User not found.</p>
          <Button className="mt-4" onClick={() => router.push('/admin/users')}>Back to Users</Button>
        </div>
      </div>
    );
  }

  // Only use user after confirming it exists
  const [addTxOpen, setAddTxOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [transactions, setTransactions] = useState(user.transactions);
  const [txForm, setTxForm] = useState({ type: '', amount: '', date: '', description: '', category: '' });
  const [editTxId, setEditTxId] = useState(null);
  const [deleteTxId, setDeleteTxId] = useState(null);
  const [cards, setCards] = useState(user.cards);
  const [cardForm, setCardForm] = useState({ number: '', type: '', status: 'Active' });
  const [editCardId, setEditCardId] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [accounts, setAccounts] = useState(user.accounts || [
    { id: 'a1', number: '1234567890', type: 'Checking', balance: 1000, status: 'Active' },
    { id: 'a2', number: '9876543210', type: 'Savings', balance: 5000, status: 'Active' },
  ]);
  const [accountForm, setAccountForm] = useState({ number: '', type: '', balance: '', status: 'Active' });
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [editAccountId, setEditAccountId] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [accountError, setAccountError] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Button variant="ghost" className="mb-2" onClick={() => router.push('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
        </Button>
        <Card className="p-4 sm:p-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">{user.role}</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">Balance: ${user.balance.toFixed(2)}</span>
          </div>
        </Card>

        {/* Cards Section */}
        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Cards</h2>
            <Button size="sm" variant="outline" onClick={() => { setAddCardOpen(true); setCardForm({ number: '', type: '', status: 'Active' }); setEditCardId(null); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Card
            </Button>
          </div>
          {cards.length === 0 ? (
            <p className="text-gray-500 text-sm">No cards found.</p>
          ) : (
            <ul className="space-y-2">
              {cards.map(card => (
                <li key={card.id} className="flex items-center gap-4">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <span className="font-mono">{card.number}</span>
                  <span className="text-xs text-gray-500">{card.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${card.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{card.status}</span>
                  <Button size="xs" variant="outline" onClick={() => { setAddCardOpen(true); setCardForm(card); setEditCardId(card.id); }}>Edit</Button>
                  <Button size="xs" variant="destructive" onClick={() => setDeleteCardId(card.id)}>Delete</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Accounts Section */}
        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Accounts ({accounts.length})</h2>
            <Button size="sm" variant="outline" onClick={() => { setAddAccountOpen(true); setAccountForm({ number: '', type: '', balance: '', status: 'Active' }); setEditAccountId(null); setAccountError(''); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Account
            </Button>
          </div>
          {accounts.length === 0 ? (
            <p className="text-gray-500 text-sm">No accounts found.</p>
          ) : (
            <ul className="space-y-2">
              {accounts.map(account => (
                <li key={account.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-mono">{account.number}</span>
                  <span className="text-xs text-gray-500">{account.type}</span>
                  <span className="text-xs text-gray-500">${Number(account.balance).toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{account.status}</span>
                  <Button size="xs" variant="outline" onClick={() => { setAddAccountOpen(true); setAccountForm(account); setEditAccountId(account.id); setAccountError(''); }}>Edit</Button>
                  <Button size="xs" variant="destructive" onClick={() => setDeleteAccountId(account.id)}>Delete</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Transactions Section */}
        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <Button size="sm" variant="outline" onClick={() => { setAddTxOpen(true); setTxForm({ type: '', amount: '', date: '', description: '', category: '' }); setEditTxId(null); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Transaction
            </Button>
          </div>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions found.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map(tx => (
                <li key={tx.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-semibold">{tx.type}</span>
                  <span className="font-mono">${Number(tx.amount).toFixed(2)}</span>
                  <span className="text-xs text-gray-500">{tx.date}</span>
                  <span className="text-xs text-gray-500">{tx.category}</span>
                  <span className="text-xs text-gray-500">{tx.description}</span>
                  <Button size="xs" variant="outline" onClick={() => { setAddTxOpen(true); setTxForm(tx); setEditTxId(tx.id); }}>Edit</Button>
                  <Button size="xs" variant="destructive" onClick={() => setDeleteTxId(tx.id)}>Delete</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Add/Edit Transaction Dialog */}
        {addTxOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">{editTxId ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <form
                className="space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  if (editTxId) {
                    setTransactions(transactions.map(tx => tx.id === editTxId ? { ...tx, ...txForm, amount: parseFloat(txForm.amount) } : tx));
                  } else {
                    setTransactions([
                      ...transactions,
                      {
                        id: 't' + (Date.now() + Math.random()),
                        ...txForm,
                        amount: parseFloat(txForm.amount),
                      },
                    ]);
                  }
                  setTxForm({ type: '', amount: '', date: '', description: '', category: '' });
                  setAddTxOpen(false);
                  setEditTxId(null);
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <input
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Deposit or Withdrawal"
                    value={txForm.type}
                    onChange={e => setTxForm(f => ({ ...f, type: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Amount"
                    value={txForm.amount}
                    onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border rounded p-2"
                    value={txForm.date}
                    onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Category"
                    value={txForm.category}
                    onChange={e => setTxForm(f => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Description"
                    value={txForm.description}
                    onChange={e => setTxForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setAddTxOpen(false); setEditTxId(null); }}>Cancel</Button>
                  <Button type="submit">{editTxId ? 'Save' : 'Add'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Transaction Dialog */}
        {deleteTxId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">Delete Transaction</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this transaction?</p>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDeleteTxId(null)}>Cancel</Button>
                <Button type="button" variant="destructive" onClick={() => { setTransactions(transactions.filter(tx => tx.id !== deleteTxId)); setDeleteTxId(null); }}>Delete</Button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Card Dialog */}
        {addCardOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">{editCardId ? 'Edit Card' : 'Add Card'}</h3>
              <form
                className="space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  if (editCardId) {
                    setCards(cards.map(card => card.id === editCardId ? { ...card, ...cardForm } : card));
                  } else {
                    setCards([
                      ...cards,
                      {
                        id: 'c' + (Date.now() + Math.random()),
                        ...cardForm,
                      },
                    ]);
                  }
                  setCardForm({ number: '', type: '', status: 'Active' });
                  setAddCardOpen(false);
                  setEditCardId(null);
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="**** **** **** 1234"
                    value={cardForm.number}
                    onChange={e => setCardForm(f => ({ ...f, number: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <input
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Visa, MasterCard, etc."
                    value={cardForm.type}
                    onChange={e => setCardForm(f => ({ ...f, type: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="mt-1 block w-full border rounded p-2"
                    value={cardForm.status}
                    onChange={e => setCardForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setAddCardOpen(false); setEditCardId(null); }}>Cancel</Button>
                  <Button type="submit">{editCardId ? 'Save' : 'Add'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Card Dialog */}
        {deleteCardId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">Delete Card</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this card?</p>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDeleteCardId(null)}>Cancel</Button>
                <Button type="button" variant="destructive" onClick={() => { setCards(cards.filter(card => card.id !== deleteCardId)); setDeleteCardId(null); }}>Delete</Button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Account Dialog */}
        {addAccountOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">{editAccountId ? 'Edit Account' : 'Add Account'}</h3>
              <form
                className="space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  // Validation
                  if (!accountForm.number || accountForm.number.length < 6) {
                    setAccountError('Account number must be at least 6 characters.');
                    return;
                  }
                  if (!accountForm.type) {
                    setAccountError('Account type is required.');
                    return;
                  }
                  setAccountError('');
                  if (editAccountId) {
                    setAccounts(accounts.map(acc => acc.id === editAccountId ? { ...acc, ...accountForm, balance: parseFloat(accountForm.balance) } : acc));
                  } else {
                    setAccounts([
                      ...accounts,
                      {
                        id: 'a' + (Date.now() + Math.random()),
                        ...accountForm,
                        balance: parseFloat(accountForm.balance),
                      },
                    ]);
                  }
                  setAccountForm({ number: '', type: '', balance: '', status: 'Active' });
                  setAddAccountOpen(false);
                  setEditAccountId(null);
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Account Number"
                    value={accountForm.number}
                    onChange={e => setAccountForm(f => ({ ...f, number: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <input
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Checking, Savings, etc."
                    value={accountForm.type}
                    onChange={e => setAccountForm(f => ({ ...f, type: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Balance"
                    value={accountForm.balance}
                    onChange={e => setAccountForm(f => ({ ...f, balance: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="mt-1 block w-full border rounded p-2"
                    value={accountForm.status}
                    onChange={e => setAccountForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>
                {accountError && <div className="text-red-600 text-sm">{accountError}</div>}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setAddAccountOpen(false); setEditAccountId(null); setAccountError(''); }}>Cancel</Button>
                  <Button type="submit">{editAccountId ? 'Save' : 'Add'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Account Dialog */}
        {deleteAccountId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this account?</p>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDeleteAccountId(null)}>Cancel</Button>
                <Button type="button" variant="destructive" onClick={() => { setAccounts(accounts.filter(acc => acc.id !== deleteAccountId)); setDeleteAccountId(null); }}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 