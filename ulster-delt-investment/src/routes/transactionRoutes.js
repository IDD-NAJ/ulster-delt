const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - investmentId
 *               - type
 *               - amount
 *               - price
 *               - quantity
 *             properties:
 *               investmentId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [BUY, SELL, DIVIDEND, INTEREST, FEE, ADJUSTMENT]
 *               amount:
 *                 type: number
 *               price:
 *                 type: number
 *                 minimum: 0
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               fees:
 *                 type: number
 *                 minimum: 0
 *               tax:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.post('/', auth, validate(schemas.transaction), transactionController.create);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, transactionController.getAll);

/**
 * @swagger
 * /api/transactions/investment/{investmentId}:
 *   get:
 *     summary: Get transactions for a specific investment
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: investmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions for the investment
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.get('/investment/:investmentId', auth, transactionController.getByInvestment);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', auth, transactionController.getOne);

/**
 * @swagger
 * /api/transactions/{id}/status:
 *   put:
 *     summary: Update transaction status
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED, CANCELLED]
 *     responses:
 *       200:
 *         description: Transaction status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.put('/:id/status', auth, validate(schemas.transactionStatus), transactionController.updateStatus);

/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: Get transaction summary
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Transaction summary
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', auth, transactionController.getSummary);

module.exports = router; 