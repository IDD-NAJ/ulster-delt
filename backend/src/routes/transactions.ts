import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['Credit', 'Debit']),
  description: z.string().optional(),
  accountId: z.string()
});

// Get all transactions for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId },
      include: {
        account: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Get transactions for a specific account
router.get('/account/:accountId', authenticateToken, async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.params.accountId }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (account.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const transactions = await prisma.transaction.findMany({
      where: { accountId: req.params.accountId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Create new transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = createTransactionSchema.parse(req.body);

    // Verify account ownership
    const account = await prisma.account.findUnique({
      where: { id: data.accountId }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (account.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Create the transaction
      const transaction = await prisma.transaction.create({
        data: {
          ...data,
          userId: req.user.userId,
          status: 'Completed'
        }
      });

      // Update account balance
      const newBalance = data.type === 'Credit' 
        ? account.balance + data.amount 
        : account.balance - data.amount;

      if (newBalance < 0) {
        throw new Error('Insufficient funds');
      }

      await prisma.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance }
      });

      return transaction;
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error.message === 'Insufficient funds') {
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

export default router; 