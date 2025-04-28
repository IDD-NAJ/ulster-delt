import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  phoneNumber: z.string().optional(),
});

export const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

export const securityInfoSchema = z.object({
  pin: z.string().min(4).max(6),
  identificationType: z.enum(["SSN", "IBAN"]),
  identificationNumber: z.string().min(1),
  securityQuestion: z.string().min(1),
  securityAnswer: z.string().min(1),
});

export const accountSchema = z.object({
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT", "INVESTMENT"]),
  balance: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP"]),
  name: z.string().min(1),
});

export const transactionSchema = z.object({
  type: z.enum(["DEBIT", "CREDIT"]),
  amount: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP"]),
  description: z.string().min(1),
  accountId: z.string().min(1),
  categoryId: z.string().optional(),
  date: z.date(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const recurringTransactionSchema = z.object({
  type: z.enum(["DEBIT", "CREDIT"]),
  amount: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP"]),
  description: z.string().min(1),
  accountId: z.string().min(1),
  categoryId: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const transactionTemplateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["DEBIT", "CREDIT"]),
  amount: z.number().positive(),
  currency: z.string().min(3).max(3),
  description: z.string().min(1),
  categoryId: z.string().optional(),
  reference: z.string().optional(),
}); 