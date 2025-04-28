export type User = {
  id: string;
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SecurityInfo = {
  id: string;
  pin: string;
  identificationType: string;
  identificationNumber: string;
  securityQuestion: string;
  securityAnswer: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id: string;
  type: string;
  balance: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  userId: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  categoryId?: string;
  recurringTransactionId?: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionCategory = {
  id: string;
  userId: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RecurringTransaction = {
  id: string;
  userId: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  categoryId?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: Date;
  endDate?: Date;
  nextDue: Date;
  lastProcessed?: Date;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionTemplate = {
  id: string;
  userId: string;
  name: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  categoryId?: string;
  accountId: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}; 