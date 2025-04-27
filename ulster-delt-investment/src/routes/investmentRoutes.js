const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { protect } = require('../middleware/auth');
const { validateRequest, validateBusinessRules } = require('../utils/validation');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Investments
 *   description: Investment management
 */

/**
 * @swagger
 * /api/investments:
 *   post:
 *     summary: Create a new investment
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - symbol
 *               - quantity
 *               - purchasePrice
 *               - currentPrice
 *               - purchaseDate
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [STOCK, BOND, MUTUAL_FUND, ETF, CRYPTO, REAL_ESTATE]
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *               purchasePrice:
 *                 type: number
 *                 minimum: 0
 *               currentPrice:
 *                 type: number
 *                 minimum: 0
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Investment created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, validate(schemas.investment), investmentController.create);

/**
 * @swagger
 * /api/investments:
 *   get:
 *     summary: Get all investments
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of investments
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, investmentController.getAll);

/**
 * @swagger
 * /api/investments/{id}:
 *   get:
 *     summary: Get investment by ID
 *     tags: [Investments]
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
 *         description: Investment details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.get('/:id', auth, investmentController.getOne);

/**
 * @swagger
 * /api/investments/{id}:
 *   put:
 *     summary: Update investment
 *     tags: [Investments]
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
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *               currentPrice:
 *                 type: number
 *                 minimum: 0
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, SOLD, PENDING]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Investment updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.put('/:id', auth, validate(schemas.investmentUpdate), investmentController.update);

/**
 * @swagger
 * /api/investments/{id}:
 *   delete:
 *     summary: Delete investment
 *     tags: [Investments]
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
 *         description: Investment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.delete('/:id', auth, investmentController.delete);

/**
 * @swagger
 * /api/investments/{id}/price:
 *   put:
 *     summary: Update investment price
 *     tags: [Investments]
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
 *               - price
 *             properties:
 *               price:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Price updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.put('/:id/price', auth, validate(schemas.priceUpdate), investmentController.updatePrice);

/**
 * @swagger
 * /api/investments/{id}/performance:
 *   get:
 *     summary: Get investment performance
 *     tags: [Investments]
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
 *         description: Investment performance
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.get('/:id/performance', auth, investmentController.getPerformance);

// Protect all investment routes
router.use(protect);

// Get all investments
router.get('/', investmentController.getInvestments);

// Create new investment
router.post('/',
    validateRequest('create'),
    validateBusinessRules.createInvestment,
    investmentController.createInvestment
);

// Get investment by ID
router.get('/:id', investmentController.getInvestment);

// Update investment
router.put('/:id',
    validateRequest('update'),
    validateBusinessRules.updateInvestment,
    investmentController.updateInvestment
);

// Get investment returns
router.get('/:id/returns',
    validateRequest('returns'),
    investmentController.getInvestmentReturns
);

// Get portfolio diversification
router.get('/diversification', investmentController.getDiversification);

// Get risk metrics
router.get('/risk', investmentController.getRiskMetrics);

// Get monthly performance report
router.get('/reports/monthly',
    validateRequest('performance'),
    investmentController.getMonthlyReport
);

// Get tax report
router.get('/reports/tax',
    validateRequest('tax'),
    investmentController.getTaxReport
);

// Get portfolio allocation report
router.get('/reports/allocation', investmentController.getAllocationReport);

module.exports = router; 