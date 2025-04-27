const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generate OTP secret
const generateOTP = () => {
  return speakeasy.generateSecret({
    name: 'Ulster Delt Investment'
  });
};

// Verify OTP token
const verifyOTP = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  });
};

// Generate QR code for 2FA setup
const generateQRCode = async (secret) => {
  try {
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret,
      label: 'Ulster Delt Investment',
      issuer: 'Ulster Delt Investment'
    });

    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Generate backup codes
const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
};

module.exports = {
  generateOTP,
  verifyOTP,
  generateQRCode,
  generateBackupCodes
}; 