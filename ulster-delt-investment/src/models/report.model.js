const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['PORTFOLIO', 'INVESTMENT', 'TRANSACTION', 'TAX', 'PERFORMANCE'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    period: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    format: {
        type: String,
        enum: ['PDF', 'CSV', 'JSON'],
        default: 'PDF'
    },
    status: {
        type: String,
        enum: ['PENDING', 'GENERATING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    fileUrl: {
        type: String
    },
    metadata: {
        generatedAt: {
            type: Date,
            default: Date.now
        },
        generatedBy: {
            type: String
        },
        version: {
            type: String
        }
    }
}, {
    timestamps: true
});

// Virtual for report age
reportSchema.virtual('age').get(function() {
    return Date.now() - this.metadata.generatedAt;
});

// Method to check if report is expired (older than 30 days)
reportSchema.methods.isExpired = function() {
    return this.age > 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
};

// Method to get report summary
reportSchema.methods.getSummary = function() {
    return {
        id: this._id,
        type: this.type,
        title: this.title,
        period: this.period,
        status: this.status,
        generatedAt: this.metadata.generatedAt,
        format: this.format
    };
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 