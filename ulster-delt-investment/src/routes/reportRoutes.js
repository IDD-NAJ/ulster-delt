const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation and management
 */

/**
 * @swagger
 * /api/reports/portfolio/{portfolioId}:
 *   post:
 *     summary: Generate portfolio report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
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
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               format:
 *                 type: string
 *                 enum: [PDF, CSV, JSON]
 *                 default: PDF
 *     responses:
 *       201:
 *         description: Portfolio report generated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 */
router.post('/portfolio/:portfolioId', auth, validate(schemas.reportPeriod), reportController.generatePortfolioReport);

/**
 * @swagger
 * /api/reports/investment/{investmentId}:
 *   post:
 *     summary: Generate investment report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: investmentId
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
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               format:
 *                 type: string
 *                 enum: [PDF, CSV, JSON]
 *                 default: PDF
 *     responses:
 *       201:
 *         description: Investment report generated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
router.post('/investment/:investmentId', auth, validate(schemas.reportPeriod), reportController.generateInvestmentReport);

/**
 * @swagger
 * /api/reports/tax/{year}:
 *   post:
 *     summary: Generate tax report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [PDF, CSV, JSON]
 *                 default: PDF
 *     responses:
 *       201:
 *         description: Tax report generated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/tax/:year', auth, validate(schemas.reportFormat), reportController.generateTaxReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, reportController.getAll);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
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
 *         description: Report details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 */
router.get('/:id', auth, reportController.getOne);

/**
 * @swagger
 * /api/reports/{id}/download:
 *   get:
 *     summary: Download report
 *     tags: [Reports]
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
 *         description: Report file
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 */
router.get('/:id/download', auth, reportController.download);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete report
 *     tags: [Reports]
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
 *         description: Report deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 */
router.delete('/:id', auth, reportController.delete);

module.exports = router; 