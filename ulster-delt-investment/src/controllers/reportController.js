const ReportService = require('../services/reportService');
const Report = require('../models/report.model');
const { ValidationError, NotFoundError } = require('../utils/errors');

const reportController = {
    // Generate portfolio report
    generatePortfolioReport: async (req, res, next) => {
        try {
            const { portfolioId } = req.params;
            const { startDate, endDate, format } = req.body;

            if (!startDate || !endDate) {
                throw new ValidationError('Start date and end date are required');
            }

            const period = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            const report = await ReportService.generatePortfolioReport(
                req.user._id,
                portfolioId,
                period,
                format
            );

            res.status(201).json({
                message: 'Portfolio report generated successfully',
                report: report.getSummary()
            });
        } catch (error) {
            next(error);
        }
    },

    // Generate investment report
    generateInvestmentReport: async (req, res, next) => {
        try {
            const { investmentId } = req.params;
            const { startDate, endDate, format } = req.body;

            if (!startDate || !endDate) {
                throw new ValidationError('Start date and end date are required');
            }

            const period = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            const report = await ReportService.generateInvestmentReport(
                req.user._id,
                investmentId,
                period,
                format
            );

            res.status(201).json({
                message: 'Investment report generated successfully',
                report: report.getSummary()
            });
        } catch (error) {
            next(error);
        }
    },

    // Generate tax report
    generateTaxReport: async (req, res, next) => {
        try {
            const { year } = req.params;
            const { format } = req.body;

            if (!year || year < 2000 || year > new Date().getFullYear()) {
                throw new ValidationError('Invalid year');
            }

            const report = await ReportService.generateTaxReport(
                req.user._id,
                parseInt(year),
                format
            );

            res.status(201).json({
                message: 'Tax report generated successfully',
                report: report.getSummary()
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all reports for a user
    getAll: async (req, res, next) => {
        try {
            const reports = await Report.find({ user: req.user._id })
                .sort({ createdAt: -1 });

            res.json(reports.map(report => report.getSummary()));
        } catch (error) {
            next(error);
        }
    },

    // Get report by ID
    getOne: async (req, res, next) => {
        try {
            const report = await Report.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!report) {
                throw new NotFoundError('Report not found');
            }

            res.json(report);
        } catch (error) {
            next(error);
        }
    },

    // Download report
    download: async (req, res, next) => {
        try {
            const report = await Report.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!report) {
                throw new NotFoundError('Report not found');
            }

            if (report.status !== 'COMPLETED') {
                throw new ValidationError('Report is not ready for download');
            }

            if (report.isExpired()) {
                throw new ValidationError('Report has expired');
            }

            res.download(report.fileUrl);
        } catch (error) {
            next(error);
        }
    },

    // Delete report
    delete: async (req, res, next) => {
        try {
            const report = await Report.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!report) {
                throw new NotFoundError('Report not found');
            }

            // Delete report file
            if (report.fileUrl) {
                await fs.promises.unlink(report.fileUrl);
            }

            res.json({
                message: 'Report deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = reportController; 