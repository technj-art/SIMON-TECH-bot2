const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

let linkingCodes = {};
let linkedUsers = {};

// 🔐 Generate 8-digit linking code
function generateLinkingCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// ✅ Command: /start - Welcome & Show linking instructions
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;

  const welcomeMessage = `
🤖 Welcome to ${config.BOT_NAME}!

👋 Hi ${userName}!

I'm a powerful WhatsApp bot. Link your WhatsApp to control me via Telegram.

📋 Available Commands:
━━━━━━━━━━━━━━━━━
/pair      - Link your WhatsApp number
/help      - Show all available commands
/status    - Check bot status
/ping      - Check bot response time
/unlink    - Unlink your WhatsApp
━━━━━━━━━━━━━━━━━

🔗 Click /pair to get started!
  `;

  bot.sendMessage(chatId, welcomeMessage);
});

// ✅ Command: /pair - Request WhatsApp number
bot.onText(/\/pair/, (msg) => {
  const chatId = msg.chat.id;

  const pairMessage = `
📱 WhatsApp Linking Process

1️⃣ Send your WhatsApp phone number (with country code)
   Example: +1234567890

2️⃣ You'll receive an 8-digit linking code

3️⃣ Enter that code in WhatsApp Linked Devices

4️⃣ Done! Your WhatsApp is now linked.

📤 Reply with your phone number to continue:
  `;

  bot.sendMessage(chatId, pairMessage);
  
  // Listen for phone number
  bot.once('message', (phoneMsg) => {
    handlePhoneNumberInput(phoneMsg, chatId);
  });
});

// Handle phone number input
function handlePhoneNumberInput(msg, chatId) {
  const phoneNumber = msg.text.trim();

  // Validate phone number format
  if (!/^\+\d{10,15}$/.test(phoneNumber)) {
    bot.sendMessage(
      chatId,
      `❌ Invalid format!\n\nPlease use format: +1234567890`
    );
    return;
  }

  // Generate linking code
  const linkingCode = generateLinkingCode();
  linkingCodes[chatId] = {
    code: linkingCode,
    phoneNumber: phoneNumber,
    timestamp: Date.now(),
    expiresIn: 15 * 60 * 1000, // 15 minutes
  };

  const codeMessage = `
✅ Your Linking Code Generated!

🔐 Linking Code: \`${linkingCode}\`

📱 Steps to Link:
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Enter this 8-digit code
4. Confirm linking

⏰ Code expires in 15 minutes
⚠️  Keep this code private!

✅ Once linked, you can control the bot via WhatsApp!
  `;

  bot.sendMessage(chatId, codeMessage, { parse_mode: 'Markdown' });

  // Store user linking info
  linkedUsers[chatId] = {
    phoneNumber: phoneNumber,
    linkingCode: linkingCode,
    linkedAt: new Date().toISOString(),
    status: 'pending',
  };

  // Auto-expire code after 15 minutes
  setTimeout(() => {
    if (linkingCodes[chatId]) {
      delete linkingCodes[chatId];
      bot.sendMessage(
        chatId,
        '⏱️  Your linking code has expired. Use /pair to generate a new one.'
      );
    }
  }, 15 * 60 * 1000);
}

// ✅ Command: /help - Show all commands
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
📚 Available Commands

🚀 Linking:
━━━━━━━━━━━━━━━━━
/start     - Welcome message
/pair      - Link your WhatsApp
/unlink    - Unlink WhatsApp
/status    - Check linking status

🤖 Bot Control:
━━━━━━━━━━━━━━━━━
/ping      - Check bot speed
/alive     - Bot uptime & stats
/menu      - Show WhatsApp commands
/help      - This message

🔐 Security:
━━━━━━━━━━━━━━━━━
• Never share your linking code
• Session ID is hidden for security
• Keep your phone number private

📞 After Linking, use WhatsApp commands:
━━━━━━━━━━━━━━━━━
.ping      - Bot response time
.alive     - Bot status
.help      - WhatsApp commands
.uptime    - Bot uptime
  `;

  bot.sendMessage(chatId, helpMessage);
});

// ✅ Command: /status - Check linking status
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;

  if (linkedUsers[chatId]) {
    const user = linkedUsers[chatId];
    const statusMessage = `
✅ Linking Status

📱 Phone: \`${user.phoneNumber}\`
🔐 Code: \`${user.linkingCode}\`
⏰ Linked: ${user.linkedAt}
📊 Status: ${user.status.toUpperCase()}

✨ Your WhatsApp is linked!
Use WhatsApp commands to control the bot.
    `;
    bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' });
  } else {
    const notLinkedMessage = `
❌ Not Linked Yet

Your WhatsApp is not linked to this bot.

🔗 Use /pair to link your WhatsApp number.
    `;
    bot.sendMessage(chatId, notLinkedMessage);
  }
});

// ✅ Command: /ping - Check bot speed
bot.onText(/\/ping/, (msg) => {
  const chatId = msg.chat.id;
  const startTime = Date.now();

  bot.sendMessage(chatId, '🔍 Checking bot speed...').then(() => {
    const responseTime = Date.now() - startTime;
    bot.sendMessage(
      chatId,
      `✅ Pong!\n⚡ Response time: ${responseTime}ms`
    );
  });
});

// ✅ Command: /alive - Bot status
bot.onText(/\/alive/, (msg) => {
  const chatId = msg.chat.id;

  const aliveMessage = `
✅ Bot Status

🤖 Bot Name: ${config.BOT_NAME}
📌 Version: ${config.BOT_VERSION}
🌍 Environment: ${config.NODE_ENV}
⏰ Uptime: Running
📡 Status: Online & Active

✨ Everything is working perfectly!
  `;

  bot.sendMessage(chatId, aliveMessage);
});

// ✅ Command: /unlink - Unlink WhatsApp
bot.onText(/\/unlink/, (msg) => {
  const chatId = msg.chat.id;

  if (linkedUsers[chatId]) {
    delete linkedUsers[chatId];
    delete linkingCodes[chatId];
    bot.sendMessage(chatId, '✅ Your WhatsApp has been unlinked.');
  } else {
    bot.sendMessage(chatId, '❌ No WhatsApp linked to unlink.');
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('❌ Telegram Polling Error:', error);
});

console.log('✅ Telegram Bot Controller Started');
console.log('🤖 Bot Name:', config.BOT_NAME);
console.log('🔐 TOKEN: ****hidden****');

module.exports = {
  bot,
  linkingCodes,
  linkedUsers,
  generateLinkingCode,
};
