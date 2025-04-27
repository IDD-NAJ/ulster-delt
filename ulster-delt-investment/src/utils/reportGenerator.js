const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const { logger } = require('./logger');

class ReportGenerator {
    constructor() {
        this.templates = {
            users: this.userReportTemplate,
            system: this.systemReportTemplate,
            investments: this.investmentReportTemplate,
            transactions: this.transactionReportTemplate
        };
    }

    async generateReport({ type, data, format = 'pdf', options = {} }) {
        try {
            const template = this.templates[type];
            if (!template) {
                throw new Error(`Unsupported report type: ${type}`);
            }

            switch (format.toLowerCase()) {
                case 'pdf':
                    return await this.generatePDF(template, data, options);
                case 'json':
                    return this.generateJSON(template, data, options);
                case 'csv':
                    return this.generateCSV(template, data, options);
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
        } catch (error) {
            logger.error('Error generating report:', error);
            throw error;
        }
    }

    // PDF Generation
    async generatePDF(template, data, options) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const chunks = [];

                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Add header
                this.addPDFHeader(doc, options);

                // Generate content using template
                template(doc, data, options);

                // Add footer
                this.addPDFFooter(doc, options);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    // JSON Generation
    generateJSON(template, data, options) {
        const report = {
            title: options.title || 'Report',
            generatedAt: new Date().toISOString(),
            data: template(null, data, options)
        };

        return JSON.stringify(report, null, 2);
    }

    // CSV Generation
    generateCSV(template, data, options) {
        const report = template(null, data, options);
        const headers = Object.keys(report[0]);
        const rows = report.map(item => headers.map(header => item[header]));
        
        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    // PDF Header
    addPDFHeader(doc, options) {
        doc.fontSize(20)
           .text(options.title || 'Report', { align: 'center' })
           .moveDown();

        if (options.startDate || options.endDate) {
            doc.fontSize(12)
               .text(`Period: ${options.startDate ? format(new Date(options.startDate), 'PP') : 'All time'} - ${options.endDate ? format(new Date(options.endDate), 'PP') : 'Present'}`, { align: 'center' })
               .moveDown();
        }

        doc.fontSize(10)
           .text(`Generated on: ${format(new Date(), 'PPpp')}`, { align: 'right' })
           .moveDown();
    }

    // PDF Footer
    addPDFFooter(doc, options) {
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);
            doc.fontSize(8)
               .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, { align: 'center' });
        }
    }

    // Report Templates
    userReportTemplate(doc, data, options) {
        if (doc) {
            // PDF format
            doc.fontSize(14)
               .text('User Statistics', { underline: true })
               .moveDown();

            // Summary
            doc.fontSize(12)
               .text(`Total Users: ${data.length}`)
               .text(`Verified Users: ${data.filter(user => user.isVerified).length}`)
               .text(`Users with 2FA: ${data.filter(user => user.twoFactorEnabled).length}`)
               .moveDown();

            // User details
            data.forEach(user => {
                doc.fontSize(10)
                   .text(`User: ${user.firstName} ${user.lastName}`)
                   .text(`Email: ${user.email}`)
                   .text(`Role: ${user.role}`)
                   .text(`Status: ${user.isVerified ? 'Verified' : 'Unverified'}`)
                   .moveDown();
            });
        } else {
            // JSON/CSV format
            return data.map(user => ({
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                twoFactorEnabled: user.twoFactorEnabled,
                createdAt: user.createdAt
            }));
        }
    }

    systemReportTemplate(doc, data, options) {
        if (doc) {
            // PDF format
            doc.fontSize(14)
               .text('System Statistics', { underline: true })
               .moveDown();

            // System metrics
            doc.fontSize(12)
               .text('System Metrics')
               .text(`CPU Usage: ${data.metrics.system.cpu.user}%`)
               .text(`Memory Usage: ${(data.metrics.system.memory.heapUsed / data.metrics.system.memory.heapTotal * 100).toFixed(2)}%`)
               .text(`Uptime: ${Math.floor(data.metrics.system.uptime / 3600)} hours`)
               .moveDown();

            // Performance metrics
            doc.text('Performance Metrics')
               .text(`Response Time: ${data.performance.responseTime}ms`)
               .text(`Error Rate: ${data.performance.errorRate}%`)
               .text(`Active Users: ${data.performance.activeUsers}`)
               .moveDown();

            // Alerts
            if (data.alerts && data.alerts.length > 0) {
                doc.text('Recent Alerts')
                   .moveDown();
                data.alerts.forEach(alert => {
                    doc.fontSize(10)
                       .text(`Type: ${alert.type}`)
                       .text(`Message: ${alert.message}`)
                       .text(`Severity: ${alert.severity}`)
                       .text(`Time: ${format(new Date(alert.timestamp), 'PPpp')}`)
                       .moveDown();
                });
            }
        } else {
            // JSON/CSV format
            return {
                system: {
                    cpu: data.metrics.system.cpu.user,
                    memory: (data.metrics.system.memory.heapUsed / data.metrics.system.memory.heapTotal * 100).toFixed(2),
                    uptime: Math.floor(data.metrics.system.uptime / 3600)
                },
                performance: {
                    responseTime: data.performance.responseTime,
                    errorRate: data.performance.errorRate,
                    activeUsers: data.performance.activeUsers
                },
                alerts: data.alerts.map(alert => ({
                    type: alert.type,
                    message: alert.message,
                    severity: alert.severity,
                    timestamp: alert.timestamp
                }))
            };
        }
    }

    investmentReportTemplate(doc, data, options) {
        if (doc) {
            // PDF format
            doc.fontSize(14)
               .text('Investment Statistics', { underline: true })
               .moveDown();

            // Summary
            const totalAmount = data.reduce((sum, inv) => sum + inv.amount, 0);
            doc.fontSize(12)
               .text(`Total Investments: ${data.length}`)
               .text(`Total Amount: $${totalAmount.toFixed(2)}`)
               .moveDown();

            // Investment details
            data.forEach(investment => {
                doc.fontSize(10)
                   .text(`Type: ${investment.type}`)
                   .text(`Amount: $${investment.amount.toFixed(2)}`)
                   .text(`Status: ${investment.status}`)
                   .text(`Created: ${format(new Date(investment.createdAt), 'PP')}`)
                   .moveDown();
            });
        } else {
            // JSON/CSV format
            return data.map(investment => ({
                type: investment.type,
                amount: investment.amount,
                status: investment.status,
                createdAt: investment.createdAt
            }));
        }
    }

    transactionReportTemplate(doc, data, options) {
        if (doc) {
            // PDF format
            doc.fontSize(14)
               .text('Transaction Statistics', { underline: true })
               .moveDown();

            // Summary
            const totalAmount = data.reduce((sum, tx) => sum + tx.amount, 0);
            doc.fontSize(12)
               .text(`Total Transactions: ${data.length}`)
               .text(`Total Amount: $${totalAmount.toFixed(2)}`)
               .moveDown();

            // Transaction details
            data.forEach(transaction => {
                doc.fontSize(10)
                   .text(`Type: ${transaction.type}`)
                   .text(`Amount: $${transaction.amount.toFixed(2)}`)
                   .text(`Status: ${transaction.status}`)
                   .text(`Date: ${format(new Date(transaction.createdAt), 'PPpp')}`)
                   .moveDown();
            });
        } else {
            // JSON/CSV format
            return data.map(transaction => ({
                type: transaction.type,
                amount: transaction.amount,
                status: transaction.status,
                createdAt: transaction.createdAt
            }));
        }
    }
}

module.exports = new ReportGenerator(); 