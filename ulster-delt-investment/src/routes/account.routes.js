const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const { authMiddleware, require2FA } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Account routes
router.post('/', require2FA, accountController.createAccount);
router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccount);
router.patch('/:id', require2FA, accountController.updateAccount);
router.delete('/:id', require2FA, accountController.closeAccount);
router.get('/:id/transactions', accountController.getTransactions);

module.exports = router; 