const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Portfolios
 *   description: Portfolio management
 */

/**
 * @swagger
 * /api/portfolios:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - investments
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               investments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - investment
 *                     - allocation
 *                   properties:
 *                     investment:
 *                       type: string
 *                     allocation:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, validate(schemas.portfolio), portfolioController.create);

/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     summary: Get all portfolios
 *     tags: [Portfolios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of portfolios
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, portfolioController.getAll);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   get:
 *     summary: Get portfolio by ID
 *     tags: [Portfolios]
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
 *         description: Portfolio details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 */
router.get('/:id', auth, portfolioController.getOne);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   put:
 *     summary: Update portfolio
 *     tags: [Portfolios]
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
 *               description:
 *                 type: string
 *               investments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - investment
 *                     - allocation
 *                   properties:
 *                     investment:
 *                       type: string
 *                     allocation:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 */
router.put('/:id', auth, validate(schemas.portfolioUpdate), portfolioController.update);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   delete:
 *     summary: Delete portfolio
 *     tags: [Portfolios]
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
 *         description: Portfolio deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 */
router.delete('/:id', auth, portfolioController.delete);

/**
 * @swagger
 * /api/portfolios/{id}/performance:
 *   get:
 *     summary: Get portfolio performance
 *     tags: [Portfolios]
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
 *         description: Portfolio performance metrics
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 */
router.get('/:id/performance', auth, portfolioController.getPerformance);

/**
 * @swagger
 * /api/portfolios/{id}/risk:
 *   get:
 *     summary: Get portfolio risk metrics
 *     tags: [Portfolios]
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
 *         description: Portfolio risk metrics
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 */
router.get('/:id/risk', auth, portfolioController.getRiskMetrics);

/**
 * @swagger
 * /api/portfolios/{id}/allocation:
 *   get:
 *     summary: Get portfolio asset allocation
 *     tags: [Portfolios]
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
 *         description: Portfolio asset allocation
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 */
router.get('/:id/allocation', auth, portfolioController.getAssetAllocation);

module.exports = router; 