const nodemailer = require('nodemailer');
const { config } = require('../config');
const { logger } = require('./logger');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message
 * @returns {Promise<void>}
 */
const sendEmail = async ({ email, subject, message }) => {
  try {
    const mailOptions = {
      from: `${config.app.name} <${config.email.from}>`,
      to: email,
      subject,
      text: message,
      html: message // You can also send HTML version
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.APP_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify your Ulster Delt Investment account',
    html: `
      <h1>Welcome to Ulster Delt Investment</h1>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Reset your Ulster Delt Investment password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send transaction notification email
const sendTransactionNotification = async (email, transaction) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'New Transaction Alert',
    html: `
      <h1>Transaction Alert</h1>
      <p>A new transaction has been processed on your account:</p>
      <ul>
        <li>Type: ${transaction.type}</li>
        <li>Amount: ${transaction.formattedAmount}</li>
        <li>Date: ${transaction.createdAt}</li>
        <li>Reference: ${transaction.reference}</li>
      </ul>
      <p>If you did not authorize this transaction, please contact our support team immediately.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending transaction notification:', error);
    throw new Error('Failed to send transaction notification');
  }
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTransactionNotification
}; 