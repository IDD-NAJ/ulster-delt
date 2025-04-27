const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const Report = require('../models/report.model');
const Portfolio = require('../models/portfolio.model');
const Investment = require('../models/investment.model');
const Transaction = require('../models/transaction.model');

class ReportService {
    // Generate portfolio report
    static async generatePortfolioReport(userId, portfolioId, period, format = 'PDF') {
        try {
            const portfolio = await Portfolio.findOne({
                _id: portfolioId,
                user: userId
            }).populate('investments.investment');

            if (!portfolio) {
                throw new Error('Portfolio not found');
            }

            // Update portfolio metrics
            await portfolio.update();

            const reportData = {
                portfolio: {
                    name: portfolio.name,
                    description: portfolio.description,
                    performance: portfolio.performance,
                    riskMetrics: portfolio.riskMetrics,
                    assetAllocation: portfolio.assetAllocation
                },
                investments: portfolio.investments.map(inv => ({
                    name: inv.investment.name,
                    symbol: inv.investment.symbol,
                    type: inv.investment.type,
                    allocation: inv.allocation,
                    performance: inv.investment.performance
                }))
            };

            return await this.createReport({
                user: userId,
                type: 'PORTFOLIO',
                title: `${portfolio.name} Portfolio Report`,
                description: `Portfolio performance report for ${portfolio.name}`,
                period,
                data: reportData,
                format
            });
        } catch (error) {
            throw new Error(`Failed to generate portfolio report: ${error.message}`);
        }
    }

    // Generate investment report
    static async generateInvestmentReport(userId, investmentId, period, format = 'PDF') {
        try {
            const investment = await Investment.findOne({
                _id: investmentId,
                user: userId
            });

            if (!investment) {
                throw new Error('Investment not found');
            }

            const transactions = await Transaction.find({
                investment: investmentId,
                date: {
                    $gte: period.startDate,
                    $lte: period.endDate
                }
            }).sort({ date: 1 });

            const reportData = {
                investment: {
                    name: investment.name,
                    symbol: investment.symbol,
                    type: investment.type,
                    performance: investment.performance
                },
                transactions: transactions.map(t => ({
                    date: t.date,
                    type: t.type,
                    amount: t.amount,
                    price: t.price,
                    quantity: t.quantity,
                    fees: t.fees,
                    tax: t.tax
                }))
            };

            return await this.createReport({
                user: userId,
                type: 'INVESTMENT',
                title: `${investment.name} Investment Report`,
                description: `Investment performance report for ${investment.name}`,
                period,
                data: reportData,
                format
            });
        } catch (error) {
            throw new Error(`Failed to generate investment report: ${error.message}`);
        }
    }

    // Generate tax report
    static async generateTaxReport(userId, year, format = 'PDF') {
        try {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);

            const transactions = await Transaction.find({
                user: userId,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('investment');

            const reportData = {
                year,
                transactions: transactions.map(t => ({
                    date: t.date,
                    type: t.type,
                    investment: t.investment.name,
                    amount: t.amount,
                    fees: t.fees,
                    tax: t.tax
                })),
                summary: {
                    totalGains: transactions.reduce((sum, t) => sum + (t.type === 'SELL' ? t.amount : 0), 0),
                    totalLosses: transactions.reduce((sum, t) => sum + (t.type === 'SELL' ? -t.amount : 0), 0),
                    totalFees: transactions.reduce((sum, t) => sum + t.fees, 0),
                    totalTax: transactions.reduce((sum, t) => sum + t.tax, 0)
                }
            };

            return await this.createReport({
                user: userId,
                type: 'TAX',
                title: `Tax Report ${year}`,
                description: `Tax report for the year ${year}`,
                period: { startDate, endDate },
                data: reportData,
                format
            });
        } catch (error) {
            throw new Error(`Failed to generate tax report: ${error.message}`);
        }
    }

    // Create and save report
    static async createReport(reportData) {
        try {
            const report = new Report({
                ...reportData,
                status: 'GENERATING'
            });

            await report.save();

            // Generate report file based on format
            const fileUrl = await this.generateReportFile(report);

            report.fileUrl = fileUrl;
            report.status = 'COMPLETED';
            await report.save();

            return report;
        } catch (error) {
            if (report) {
                report.status = 'FAILED';
                await report.save();
            }
            throw error;
        }
    }

    // Generate report file
    static async generateReportFile(report) {
        switch (report.format) {
            case 'PDF':
                return await this.generatePDF(report);
            case 'CSV':
                return await this.generateCSV(report);
            case 'JSON':
                return await this.generateJSON(report);
            default:
                throw new Error('Unsupported report format');
        }
    }

    // Generate PDF report
    static async generatePDF(report) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const filename = `report-${report._id}.pdf`;
                const filepath = `./reports/${filename}`;

                // Add content to PDF
                doc.fontSize(25).text(report.title, 100, 100);
                doc.fontSize(12).text(`Generated on: ${report.metadata.generatedAt}`, 100, 150);
                doc.fontSize(12).text(`Period: ${report.period.startDate} to ${report.period.endDate}`, 100, 170);

                // Add report-specific content
                switch (report.type) {
                    case 'PORTFOLIO':
                        this.addPortfolioContent(doc, report.data);
                        break;
                    case 'INVESTMENT':
                        this.addInvestmentContent(doc, report.data);
                        break;
                    case 'TAX':
                        this.addTaxContent(doc, report.data);
                        break;
                }

                // Save PDF
                doc.pipe(fs.createWriteStream(filepath));
                doc.end();

                resolve(`/reports/${filename}`);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Generate CSV report
    static async generateCSV(report) {
        try {
            const fields = this.getCSVFields(report.type);
            const parser = new Parser({ fields });
            const csv = parser.parse(report.data);

            const filename = `report-${report._id}.csv`;
            const filepath = `./reports/${filename}`;

            await fs.promises.writeFile(filepath, csv);

            return `/reports/${filename}`;
        } catch (error) {
            throw new Error(`Failed to generate CSV: ${error.message}`);
        }
    }

    // Generate JSON report
    static async generateJSON(report) {
        try {
            const filename = `report-${report._id}.json`;
            const filepath = `./reports/${filename}`;

            await fs.promises.writeFile(filepath, JSON.stringify(report.data, null, 2));

            return `/reports/${filename}`;
        } catch (error) {
            throw new Error(`Failed to generate JSON: ${error.message}`);
        }
    }

    // Helper methods for PDF generation
    static addPortfolioContent(doc, data) {
        // Add portfolio performance
        doc.fontSize(16).text('Portfolio Performance', 100, 200);
        doc.fontSize(12).text(`Total Value: $${data.portfolio.performance.totalValue}`, 100, 230);
        doc.text(`Total Return: $${data.portfolio.performance.totalReturn}`, 100, 250);
        doc.text(`Percentage Return: ${data.portfolio.performance.percentageReturn}%`, 100, 270);

        // Add risk metrics
        doc.fontSize(16).text('Risk Metrics', 100, 300);
        doc.fontSize(12).text(`Volatility: ${data.portfolio.riskMetrics.volatility}%`, 100, 330);
        doc.text(`Sharpe Ratio: ${data.portfolio.riskMetrics.sharpeRatio}`, 100, 350);
        doc.text(`Maximum Drawdown: ${data.portfolio.riskMetrics.maxDrawdown}%`, 100, 370);

        // Add asset allocation
        doc.fontSize(16).text('Asset Allocation', 100, 400);
        data.portfolio.assetAllocation.byType.forEach((value, key) => {
            doc.fontSize(12).text(`${key}: ${value}%`, 100, 430);
        });
    }

    static addInvestmentContent(doc, data) {
        // Add investment details
        doc.fontSize(16).text('Investment Details', 100, 200);
        doc.fontSize(12).text(`Name: ${data.investment.name}`, 100, 230);
        doc.text(`Symbol: ${data.investment.symbol}`, 100, 250);
        doc.text(`Type: ${data.investment.type}`, 100, 270);

        // Add performance
        doc.fontSize(16).text('Performance', 100, 300);
        doc.fontSize(12).text(`Total Return: $${data.investment.performance.totalReturn}`, 100, 330);
        doc.text(`Percentage Return: ${data.investment.performance.percentageReturn}%`, 100, 350);

        // Add transactions
        doc.fontSize(16).text('Transactions', 100, 400);
        data.transactions.forEach((t, i) => {
            doc.fontSize(12).text(
                `${t.date.toLocaleDateString()} - ${t.type}: ${t.quantity} @ $${t.price}`,
                100,
                430 + (i * 20)
            );
        });
    }

    static addTaxContent(doc, data) {
        // Add tax summary
        doc.fontSize(16).text('Tax Summary', 100, 200);
        doc.fontSize(12).text(`Year: ${data.year}`, 100, 230);
        doc.text(`Total Gains: $${data.summary.totalGains}`, 100, 250);
        doc.text(`Total Losses: $${data.summary.totalLosses}`, 100, 270);
        doc.text(`Total Fees: $${data.summary.totalFees}`, 100, 290);
        doc.text(`Total Tax: $${data.summary.totalTax}`, 100, 310);

        // Add transactions
        doc.fontSize(16).text('Transactions', 100, 350);
        data.transactions.forEach((t, i) => {
            doc.fontSize(12).text(
                `${t.date.toLocaleDateString()} - ${t.type}: $${t.amount}`,
                100,
                380 + (i * 20)
            );
        });
    }

    // Get CSV fields based on report type
    static getCSVFields(type) {
        switch (type) {
            case 'PORTFOLIO':
                return ['name', 'symbol', 'type', 'allocation', 'totalReturn', 'percentageReturn'];
            case 'INVESTMENT':
                return ['date', 'type', 'amount', 'price', 'quantity', 'fees', 'tax'];
            case 'TAX':
                return ['date', 'type', 'investment', 'amount', 'fees', 'tax'];
            default:
                return [];
        }
    }
}

module.exports = ReportService; 