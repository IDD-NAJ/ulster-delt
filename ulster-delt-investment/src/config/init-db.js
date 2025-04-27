const mongoose = require('mongoose');
const logger = require('../utils/logger');

const initializeDatabase = async () => {
    try {
        // Create indexes for User collection
        await mongoose.model('User').createIndexes();
        logger.info('User collection indexes created');

        // Create indexes for Account collection
        await mongoose.model('Account').createIndexes();
        logger.info('Account collection indexes created');

        // Create indexes for Transaction collection
        await mongoose.model('Transaction').createIndexes();
        logger.info('Transaction collection indexes created');

        logger.info('Database initialization completed successfully');
    } catch (error) {
        logger.error(`Database initialization failed: ${error.message}`);
        throw error;
    }
};

module.exports = initializeDatabase; 