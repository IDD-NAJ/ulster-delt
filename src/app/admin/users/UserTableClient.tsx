'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { Select } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface Account {
  id: string;
  balance: number;
  type: string;
  accountNumber: string;
  transactions?: any[];
  currency?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  accountsCount: number;
  balance: number;
  accounts: Account[];
  accountId?: string;
}

interface CardData {
  id: string;
  cardNumber: string;
  expiryDate: Date;
  status: string;
  type: string;
}

interface UserTableClientProps {
  users: User[];
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  INVESTMENT: 'Investment Account',
  ESCROW: 'Escrow Account',
  CREDIT: 'Credit Account',
};

export default function UserTableClient({ users: initialUsers }: UserTableClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'USER' });
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [balanceForm, setBalanceForm] = useState({ balance: '', type: '' });
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createAccountDialogOpen, setCreateAccountDialogOpen] = useState(false);
  const [accountForm, setAccountForm] = useState({ userId: '', type: 'CHECKING', balance: '' });
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{ userId: string; accountId: string } | null>(null);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedAccountForTx, setSelectedAccountForTx] = useState<{ userId: string; account: Account } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txForm, setTxForm] = useState({ id: '', type: '', amount: '', description: '', date: new Date().toISOString().slice(0, 10), currency: '' });
  const [editTxId, setEditTxId] = useState<string | null>(null);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [userCards, setUserCards] = useState<CardData[]>([]);
  const [selectedUserForCard, setSelectedUserForCard] = useState<User | null>(null);
  const [freezeAccountsDialogOpen, setFreezeAccountsDialogOpen] = useState(false);
  const router = useRouter();

  const filteredUsers = users.filter(
    (user: User) =>
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Add User
  const handleAddUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, role: form.role }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to add user');
      }
      const newUser = await res.json();
      setUsers([newUser, ...users]);
      setForm({ name: '', email: '', role: 'USER' });
      setAddDialogOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add user';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Edit User
  const handleEditUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUser?.id, name: form.name, email: form.email, role: form.role, status: selectedUser?.status }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update user');
      }
      const updatedUser = await res.json();
      setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
      setEditDialogOpen(false);
      setSelectedUser(null);
      setForm({ name: '', email: '', role: 'USER' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userToDelete.id }),
      });
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setDeleteUserDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  // Edit Balance
  const openBalanceDialog = (user: User) => {
    setSelectedUser(user);
    // Default to first account
    const firstAcc = user.accounts[0];
    setBalanceForm({ balance: firstAcc?.balance?.toString() || '', type: firstAcc?.type || '' });
    setBalanceDialogOpen(true);
  };
  const handleEditBalance = async () => {
    setLoading(true);
    try {
      if (!selectedUser) throw new Error('No user selected');
      const firstAcc = selectedUser.accounts[0];
      if (!firstAcc) throw new Error('No account available');
      const accountId = firstAcc.id;
      const res = await fetch('/api/admin/accounts/balance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, balance: parseFloat(balanceForm.balance), type: balanceForm.type }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update balance');
      }
      const updatedAccount = await res.json();
      setUsers(users.map((u: User) =>
        u.id === selectedUser.id
          ? {
              ...u,
              accounts: u.accounts.map(acc =>
                acc.id === updatedAccount.id ? { ...acc, balance: updatedAccount.balance, type: updatedAccount.type } : acc
              ),
              balance: u.accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount.balance : acc.balance).reduce((sum, b) => sum + b, 0),
            }
          : u
      ));
      setBalanceDialogOpen(false);
      setSelectedUser(null);
      setBalanceForm({ balance: '', type: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update balance';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Freeze/Unfreeze
  const openFreezeDialog = (user: User) => {
    setSelectedUser(user);
    setFreezeDialogOpen(true);
  };
  const handleToggleFreeze = async () => {
    setLoading(true);
    try {
      const newStatus = selectedUser?.status === 'Active' ? 'Frozen' : 'Active';
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUser?.id, name: selectedUser?.name, email: selectedUser?.email, role: selectedUser?.role, status: newStatus }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update status');
      }
      const updatedUser = await res.json();
      setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
      setFreezeDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Dialog
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditDialogOpen(true);
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: accountForm.userId,
          type: accountForm.type,
          balance: parseFloat(accountForm.balance),
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create account');
      }
      const newAccount = await res.json();
      setUsers(users.map(u =>
        u.id === newAccount.userId
          ? { ...u, accounts: [...u.accounts, newAccount], balance: u.balance + newAccount.balance, accountsCount: u.accountsCount + 1 }
          : u
      ));
      setAccountForm({ userId: '', type: 'CHECKING', balance: '' });
      setCreateAccountDialogOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/accounts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: accountToDelete.accountId }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to delete account');
      }
      setUsers(users.map(u =>
        u.id === accountToDelete.userId
          ? { ...u, accounts: u.accounts.filter(acc => acc.id !== accountToDelete.accountId), accountsCount: u.accountsCount - 1, balance: u.accounts.filter(acc => acc.id !== accountToDelete.accountId).reduce((sum, acc) => sum + acc.balance, 0) }
          : u
      ));
      setDeleteAccountDialogOpen(false);
      setAccountToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const openTransactionDialog = async (user: User, account: Account) => {
    setSelectedAccountForTx({ userId: user.id, account });
    setTransactionDialogOpen(true);
    // Fetch transactions for this account
    await fetchTransactions(account.id);
    setTxForm({ id: '', type: '', amount: '', description: '', date: new Date().toISOString().slice(0, 10), currency: account.currency || 'GBP' });
    setEditTxId(null);
  };

  const fetchTransactions = async (accountId: string) => {
    const res = await fetch(`/api/admin/accounts/${accountId}/transactions`);
    if (res.ok) {
      setTransactions(await res.json());
    }
  };

  const handleAddOrEditTransaction = async () => {
    if (!selectedAccountForTx) return;
    setLoading(true);
    try {
      const method = editTxId ? 'PUT' : 'POST';
      const url = editTxId
        ? `/api/admin/accounts/${selectedAccountForTx.account.id}/transactions/${editTxId}`
        : `/api/admin/accounts/${selectedAccountForTx.account.id}/transactions`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: txForm.type,
          amount: parseFloat(txForm.amount),
          description: txForm.description,
          date: txForm.date,
          currency: txForm.currency,
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to save transaction');
      }
      // Always fetch latest transactions after add/edit
      await fetchTransactions(selectedAccountForTx.account.id);
      setTxForm({ id: '', type: '', amount: '', description: '', date: new Date().toISOString().slice(0, 10), currency: selectedAccountForTx.account.currency || 'GBP' });
      setEditTxId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save transaction';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTxClick = (tx: any) => {
    setTxForm({ id: tx.id, type: tx.type, amount: tx.amount.toString(), description: tx.description || '', date: tx.date ? tx.date.slice(0, 10) : new Date().toISOString().slice(0, 10), currency: tx.currency || selectedAccountForTx?.account.currency || 'GBP' });
    setEditTxId(tx.id);
  };

  // Add a mock transaction for demonstration
  const newTransaction = {
    id: 'mock-id-123',
    type: 'CREDIT',
    amount: 100.00,
    description: 'Test Transaction',
    createdAt: new Date(),
    status: 'COMPLETED',
    currency: 'GBP',
    category: {
      name: 'Test',
      color: '#0000FF',
      icon: '🧪'
    }
  };

  if (users[0]?.accounts[0]?.transactions) {
    users[0].accounts[0].transactions.unshift(newTransaction);
  }

  const openCardDialog = async (user: User) => {
    setSelectedUserForCard(user);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/cards`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch cards');
      }
      const cards = await res.json();
      setUserCards(cards);
      setCardDialogOpen(true);
    } catch (error) {
      console.error('Error fetching cards:', error);
      alert(error instanceof Error ? error.message : 'Failed to fetch cards');
    }
  };

  const handleAddCard = async (userId: string, accountId: string) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
      if (!res.ok) throw new Error('Failed to add card');
      const newCard = await res.json();
      setUserCards([...userCards, newCard.card]);
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to add card');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete card');
      setUserCards(userCards.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with specified permissions.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleAddUser();
                }}
                className="space-y-4"
              >
                <Input
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                <Input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
                <Select
                  value={form.role}
                  onValueChange={role => setForm(f => ({ ...f, role }))}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </Select>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add User</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => setFreezeAccountsDialogOpen(true)}>
            Freeze/Unfreeze Accounts
          </Button>
        </div>
      </div>
      {/* Search and filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>
      {/* Users table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Accounts</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      user.status === 'Active'
                        ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                        : user.status === 'Frozen'
                        ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                        : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
                    }
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <ul>
                    {user.accounts.map(acc => (
                      <li key={acc.id} className="flex items-center gap-2">
                        <span>{ACCOUNT_TYPE_LABELS[acc.type] || acc.type} (****{acc.accountNumber.slice(-4)})</span>
                        <Button size="icon" variant="ghost" onClick={() => { setAccountToDelete({ userId: user.id, accountId: acc.id }); setDeleteAccountDialogOpen(true); }} title="Delete Account">
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openTransactionDialog(user, acc)} title="Manage Transactions">
                          Transactions
                        </Button>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>£{user.balance.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openBalanceDialog(user)}>Edit Balance</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>Edit User</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setUserToDelete(user); setDeleteUserDialogOpen(true); }} className="text-red-600">
                        Delete User
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openCardDialog(user)}>
                        <CreditCardIcon className="mr-2 h-4 w-4" />
                        Manage Cards
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleEditUser();
            }}
            className="space-y-4"
          >
            <Input
              required
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <Input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <Select
              value={form.role}
              onValueChange={role => setForm(f => ({ ...f, role }))}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Select>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Balance Dialog */}
      <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Balance</DialogTitle>
            <DialogDescription>
              Update the user account balance below.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleEditBalance();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 font-medium">Account Type</label>
              <select
                className="w-full border rounded px-2 py-1 mb-2"
                value={balanceForm.type}
                onChange={e => setBalanceForm(f => ({ ...f, type: e.target.value }))}
                required
              >
                {Object.entries(ACCOUNT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <Input
              required
              type="number"
              step="0.01"
              placeholder="Balance"
              value={balanceForm.balance}
              onChange={e => setBalanceForm(f => ({ ...f, balance: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Freeze/Unfreeze Dialog */}
      <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.status === 'Active' ? 'Freeze Account' : 'Unfreeze Account'}</DialogTitle>
            <DialogDescription>
              {selectedUser?.status === 'Active'
                ? 'Are you sure you want to freeze this account? The user will not be able to access their account.'
                : 'Are you sure you want to unfreeze this account? The user will regain access.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleToggleFreeze}>
              {selectedUser?.status === 'Active' ? 'Freeze' : 'Unfreeze'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Add Create Account Button */}
      <Button onClick={() => setCreateAccountDialogOpen(true)} className="ml-2">Create Account</Button>
      {/* Create Account Dialog */}
      <Dialog open={createAccountDialogOpen} onOpenChange={setCreateAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new account for a user.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleCreateAccount();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 font-medium">User</label>
              <select
                className="w-full border rounded px-2 py-1 mb-2"
                value={accountForm.userId}
                onChange={e => setAccountForm(f => ({ ...f, userId: e.target.value }))}
                required
              >
                <option value="">Select a user</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Account Type</label>
              <select
                className="w-full border rounded px-2 py-1 mb-2"
                value={accountForm.type}
                onChange={e => setAccountForm(f => ({ ...f, type: e.target.value }))}
                required
              >
                {Object.entries(ACCOUNT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <Input
              required
              type="number"
              step="0.01"
              placeholder="Initial Balance"
              value={accountForm.balance}
              onChange={e => setAccountForm(f => ({ ...f, balance: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Account</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Transaction Dialog */}
      <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Transactions</DialogTitle>
            <DialogDescription>
              Add or edit transactions for this account.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddOrEditTransaction();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select
                className="w-full border rounded px-2 py-1 mb-2"
                value={txForm.type}
                onChange={e => setTxForm(f => ({ ...f, type: e.target.value }))}
                required
              >
                <option value="">Select type</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>
            <Input
              required
              type="number"
              step="0.01"
              placeholder="Amount"
              value={txForm.amount}
              onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))}
            />
            <Input
              required
              placeholder="Currency"
              value={txForm.currency}
              disabled
            />
            <Input
              required
              type="date"
              value={txForm.date}
              onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))}
            />
            <Input
              placeholder="Description (optional)"
              value={txForm.description}
              onChange={e => setTxForm(f => ({ ...f, description: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editTxId ? 'Save' : 'Add'} Transaction</Button>
            </div>
          </form>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Transactions</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.length === 0 && <li className="text-gray-500 text-sm">No transactions found.</li>}
              {transactions.map(tx => (
                <li key={tx.id} className="flex items-center gap-2 justify-between border-b pb-1">
                  <span className="font-mono">{tx.type}</span>
                  <span className="font-mono">£{Number(tx.amount).toFixed(2)}</span>
                  <span className="text-xs text-gray-500">{tx.description}</span>
                  <Button size="sm" variant="outline" onClick={() => handleEditTxClick(tx)}>Edit</Button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={() => userToDelete && handleDeleteUser()} disabled={loading}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Card Dialog */}
      <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Cards</DialogTitle>
            <DialogDescription>
              Add or delete cards for {selectedUserForCard?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedUserForCard?.accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{ACCOUNT_TYPE_LABELS[account.type]}</p>
                  <p className="text-sm text-gray-500">Account: {account.accountNumber}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleAddCard(selectedUserForCard.id, account.id)}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </div>
            ))}

            <div className="mt-6">
              <h4 className="font-medium mb-2">Existing Cards</h4>
              {userCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-2 border rounded mb-2">
                  <div>
                    <p className="font-medium">{card.type} Card</p>
                    <p className="text-sm text-gray-500">
                      **** **** **** {card.cardNumber.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires: {new Date(card.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {userCards.length === 0 && (
                <p className="text-sm text-gray-500 text-center">No cards found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Freeze/Unfreeze Accounts Dialog */}
      <Dialog open={freezeAccountsDialogOpen} onOpenChange={setFreezeAccountsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze/Unfreeze Accounts</DialogTitle>
            <DialogDescription>
              Toggle the status of user accounts below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between border rounded p-2">
                <div>
                  <p className="font-medium">{user.name} <span className="text-xs text-gray-500">({user.email})</span></p>
                  <p className="text-xs text-gray-500">Current status: <span className={
                    user.status === 'Active'
                      ? 'text-green-600'
                      : user.status === 'Frozen'
                      ? 'text-blue-600'
                      : 'text-red-600'
                  }>{user.status}</span></p>
                </div>
                <Button
                  size="sm"
                  variant={user.status === 'Active' ? 'destructive' : 'default'}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const newStatus = user.status === 'Active' ? 'Frozen' : 'Active';
                      const res = await fetch('/api/admin/users', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role, status: newStatus }),
                      });
                      if (!res.ok) throw new Error(await res.text() || 'Failed to update status');
                      const updatedUser = await res.json();
                      setUsers(users => users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Failed to update status');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  {user.status === 'Active' ? 'Freeze' : 'Unfreeze'}
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 