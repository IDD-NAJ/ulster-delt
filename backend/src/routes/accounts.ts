import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createAccountSchema = z.object({
  type: z.enum(['Standard', 'Smart', 'You', 'Metal'])
});

// Get all accounts for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching accounts' });
  }
});

// Get specific account
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.params.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (account.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching account' });
  }
});

// Create new account
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = createAccountSchema.parse(req.body);

    const account = await prisma.account.create({
      data: {
        accountNumber: Math.random().toString().slice(2, 12),
        type: data.type,
        userId: req.user.userId
      }
    });

    res.status(201).json(account);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Error creating account' });
  }
});

// Update account type
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const data = createAccountSchema.parse(req.body);

    const account = await prisma.account.findUnique({
      where: { id: req.params.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (account.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedAccount = await prisma.account.update({
      where: { id: req.params.id },
      data: { type: data.type }
    });

    res.json(updatedAccount);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Error updating account' });
  }
});

export default router; 