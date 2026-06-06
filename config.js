require('dotenv').config();

// Load environment variables with SESSION_ID hidden from console logs
const config = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  SESSION_ID: process.env.SESSION_ID, // ✅ Kept secret, never logged
  BOT_NAME: process.env.BOT_NAME || 'SIMON',
  BOT_PREFIX: process.env.BOT_PREFIX || '.',
  BOT_VERSION: process.env.BOT_VERSION || '2.0.0',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '+1234567890',
  OWNER_NAME: process.env.OWNER_NAME || 'SIMON TECH',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  ENABLE_AUTO_REPLY: process.env.ENABLE_AUTO_REPLY === 'true',
};

// 🔐 Function to safely log config (hiding SESSION_ID)
function logConfig() {
  const safeConfig = { ...config };
  safeConfig.SESSION_ID = '****hidden****';
  safeConfig.TELEGRAM_BOT_TOKEN = safeConfig.TELEGRAM_BOT_TOKEN ? '****hidden****' : 'NOT SET';
  console.log('📋 Bot Configuration:', safeConfig);
}

// Validate required variables
function validateConfig() {
  if (!config.TELEGRAM_BOT_TOKEN) {
    console.warn('⚠️  WARNING: TELEGRAM_BOT_TOKEN not set!');
  }
  if (!config.SESSION_ID) {
    console.warn('⚠️  WARNING: SESSION_ID not set!');
  }
}

validateConfig();
logConfig();

module.exports = config;
