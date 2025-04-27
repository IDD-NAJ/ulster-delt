const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const { validate, schemas } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Unauthorized access
 */
router.get('/users', auth, authorize('admin'), adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/users/:id', auth, authorize('admin'), adminController.getUserById);

/**
 * @swagger
 * /api/admin/users/{id}/activity:
 *   get:
 *     summary: Get user activity logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User activity logs
 */
router.get('/users/:id/activity', auth, authorize('admin'), adminController.getUserActivityLogs);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Admin]
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
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id', auth, authorize('admin'), validate(schemas.updateUser), adminController.updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', auth, authorize('admin'), adminController.deleteUser);

/**
 * @swagger
 * /api/admin/users/{id}/impersonate:
 *   post:
 *     summary: Impersonate user for support
 *     tags: [Admin]
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
 *         description: User impersonation successful
 *       404:
 *         description: User not found
 */
router.post('/users/:id/impersonate', auth, authorize('admin'), adminController.impersonateUser);

/**
 * @swagger
 * /api/admin/monitoring:
 *   get:
 *     summary: Get system monitoring data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System monitoring data
 */
router.get('/monitoring', auth, authorize('admin'), adminController.getSystemMonitoring);

/**
 * @swagger
 * /api/admin/backup:
 *   post:
 *     summary: Create system backup
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup created successfully
 */
router.post('/backup', auth, authorize('admin'), adminController.backupSystemData);

/**
 * @swagger
 * /api/admin/backup/{backupId}/restore:
 *   post:
 *     summary: Restore system from backup
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: backupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: System restored successfully
 *       404:
 *         description: Backup not found
 */
router.post('/backup/:backupId/restore', auth, authorize('admin'), adminController.restoreSystemData);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 */
router.get('/stats', auth, authorize('admin'), adminController.getSystemStats);

/**
 * @swagger
 * /api/admin/users/bulk-update:
 *   post:
 *     summary: Bulk update users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *               - updates
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               updates:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [user, admin]
 *                   isVerified:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Users updated successfully
 */
router.post('/users/bulk-update', auth, authorize('admin'), validate(schemas.bulkUpdateUsers), adminController.bulkUpdateUsers);

/**
 * @swagger
 * /api/admin/users/bulk-delete:
 *   post:
 *     summary: Bulk delete users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Users deleted successfully
 */
router.post('/users/bulk-delete', auth, authorize('admin'), validate(schemas.bulkDeleteUsers), adminController.bulkDeleteUsers);

/**
 * @swagger
 * /api/admin/reports/users:
 *   get:
 *     summary: Generate user report
 *     tags: [Admin]
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
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [pdf, json]
 *           default: pdf
 *     responses:
 *       200:
 *         description: User report generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/reports/users', auth, authorize('admin'), adminController.generateUserReport);

/**
 * @swagger
 * /api/admin/reports/system:
 *   get:
 *     summary: Generate system report
 *     tags: [Admin]
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
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [pdf, json]
 *           default: pdf
 *     responses:
 *       200:
 *         description: System report generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/reports/system', auth, authorize('admin'), adminController.generateSystemReport);

/**
 * @swagger
 * /api/admin/monitoring/metrics:
 *   get:
 *     summary: Get system metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, prometheus, graphite]
 *           default: json
module.exports = router; 