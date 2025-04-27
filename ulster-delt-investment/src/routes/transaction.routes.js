const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { authMiddleware, require2FA } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Transaction routes
router.post('/', require2FA, transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.delete('/:id', require2FA, transactionController.cancelTransaction);

module.exports = router; 