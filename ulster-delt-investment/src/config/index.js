const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

// Configuration object
const config = {
  // Application
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    name: 'Ulster Delt Investment',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'noreply@ulsterdeltinvestment.com'
  },

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ulster-delt-investment',
    user: process.env.MONGODB_USER || 'admin',
    pass: process.env.MONGODB_PASS || 'admin123',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    options: {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3
    }
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Security
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // Limit each IP to 100 requests per windowMs
    },
    authRateLimit: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5 // Limit each IP to 5 requests per windowMs
    },
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL] 
        : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400 // 24 hours
    },
    bcrypt: {
      saltRounds: 10
    }
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    errorFile: 'logs/error.log',
    combinedFile: 'logs/combined.log'
  },

  monitoring: {
    realTime: {
      updateInterval: process.env.MONITORING_UPDATE_INTERVAL || 60000,
      retentionPeriod: process.env.MONITORING_RETENTION_PERIOD || 24 * 60 * 60 * 1000,
      maxDataPoints: process.env.MONITORING_MAX_DATA_POINTS || 1440
    },
    alerts: {
      channels: {
        email: process.env.ALERT_EMAIL_ENABLED === 'true',
        slack: process.env.ALERT_SLACK_ENABLED === 'true',
        webhook: process.env.ALERT_WEBHOOK_ENABLED === 'true'
      },
      cooldowns: {
        critical: process.env.ALERT_COOLDOWN_CRITICAL || 5 * 60 * 1000,
        high: process.env.ALERT_COOLDOWN_HIGH || 15 * 60 * 1000,
        medium: process.env.ALERT_COOLDOWN_MEDIUM || 30 * 60 * 1000,
        low: process.env.ALERT_COOLDOWN_LOW || 60 * 60 * 1000
      }
    },
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL
    },
    webhook: {
      url: process.env.WEBHOOK_URL
    }
  }
};

// Validate required configurations
const validateConfig = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Export configuration
module.exports = {
  config,
  validateConfig
}; 