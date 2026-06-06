# 🔐 Security & Hidden Variables - Complete Guide

## 🚨 SESSION_ID is COMPLETELY INVISIBLE

Your `SESSION_ID` and `TELEGRAM_BOT_TOKEN` are **completely hidden** in this bot.

### ✅ Why Hidden?

- 🔒 Never appears in console logs
- 🔒 Never exposed in error messages  
- 🔒 Not stored in version control (.gitignore)
- 🔒 Only loaded from environment variables
- 🔒 Safe for public repositories

---

## 📋 Railway Environment Setup

### Step 1: Set Variables in Railway Dashboard

1. Go to your Railway project
2. Click **Variables** tab
3. Add these variables:

```
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
SESSION_ID=YOUR_WHATSAPP_SESSION_ID
BOT_NAME=SIMON
BOT_PREFIX=.
OWNER_NUMBER=+1234567890
NODE_ENV=production
```

### ✅ What You See in Logs

When bot starts:

```
📋 Bot Configuration: {
  TELEGRAM_BOT_TOKEN: '****hidden****',
  SESSION_ID: '****hidden****',
  BOT_NAME: 'SIMON',
  BOT_PREFIX: '.',
  OWNER_NUMBER: '+1234567890',
  NODE_ENV: 'production'
}

✅ Telegram Bot Controller Started
🤖 Bot Name: SIMON
🔐 TOKEN: ****hidden****
```

**SESSION_ID and TOKEN are always MASKED** ✅

---

## 🔐 How It Works

### config.js - Magic happens here:

```javascript
// ✅ SESSION_ID loaded but never logged
function logConfig() {
  const safeConfig = { ...config };
  safeConfig.SESSION_ID = '****hidden****';      // ✅ Masked
  safeConfig.TELEGRAM_BOT_TOKEN = '****hidden****'; // ✅ Masked
  console.log('📋 Bot Configuration:', safeConfig);
}
```

### Result in Console:

```
BEFORE (❌ Insecure):
SESSION_ID=eyJub2lzZUtleSI6eyJwcml2YXRlOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOls...

AFTER (✅ Secure):
SESSION_ID=****hidden****
```

---

## 🎯 Three Ways to Generate SESSION_ID

### Method 1: QR Code (Recommended)

```bash
npm run session
```

- Open: `http://localhost:3000`
- Click: **"Generate QR Code"**
- Scan: With WhatsApp app
- Copy: **SESSION_ID**
- Update: Railway variables

### Method 2: Phone Number Pairing

```bash
npm run session
```

- Go to: **"Phone Number"** tab
- Enter: Your WhatsApp number (+1234567890)
- Click: **"Request Pairing Code"**
- Get: 8-digit code
- Link: In WhatsApp Linked Devices
- Copy: **SESSION_ID**

### Method 3: Manual Generation

```bash
# Advanced users only
node session-generator-v2.js
```

---

## 🚀 Telegram Bot Setup

### Get TELEGRAM_BOT_TOKEN

1. Open Telegram app
2. Search: **@BotFather**
3. Send: `/newbot`
4. Choose: Bot name & username
5. Receive: Your **TOKEN**
   ```
   Use this token to access the HTTP API:
   123456789:ABCdefGHIjklmnoPQRstuvWXYZ
   ```
6. Copy: To Railway variables

### Never Share Your Token!

```
❌ WRONG: 123456789:ABCdefGHIjklmnoPQRstuvWXYZ
✅ RIGHT: TELEGRAM_BOT_TOKEN=****hidden****
```

---

## 📱 Telegram Commands (After Setup)

```
/start    - Welcome & linking instructions
/pair     - Link your WhatsApp number
/help     - Show all commands
/status   - Check linking status
/ping     - Check bot speed
/alive    - Bot status & uptime
/unlink   - Remove WhatsApp link
```

---

## 🔗 WhatsApp Control Commands

After linking WhatsApp via Telegram:

```
.ping     - Bot response time
.alive    - Bot status
.help     - Available commands
.uptime   - Bot uptime
.owner    - Owner information
```

---

## 🚨 EMERGENCY: Token Leaked?

### If TELEGRAM_BOT_TOKEN is exposed:

1. Open Telegram → **@BotFather**
2. Send: `/revoke`
3. Select: Your bot
4. Get: **NEW TOKEN**
5. Update: Railway variables immediately

### If SESSION_ID is exposed:

1. Stop bot on Railway
2. Run: `npm run session`
3. Generate: **NEW SESSION_ID**
4. Update: Railway variables
5. Restart: Your bot

---

## ✅ Security Checklist

- [ ] `.env` file NOT committed to git
- [ ] `.env` is in `.gitignore` ✅
- [ ] Railway variables are set correctly
- [ ] Console shows `****hidden****` for tokens
- [ ] Never paste real tokens in chat/logs
- [ ] SESSION_ID not in version control
- [ ] TELEGRAM_BOT_TOKEN not in version control
- [ ] No credentials in error messages

---

## 📂 Protected Files

### ✅ Safe to Commit:

```
✓ config.js           (masks tokens)
✓ telegram-controller.js (hides credentials)
✓ session-generator-v2.js (generates sessions)
✓ .env.example        (template only)
✓ SECURITY.md         (this file)
✓ .gitignore          (protection list)
```

### ❌ NEVER Commit:

```
✗ .env                (local secrets)
✗ sessions/           (contains credentials)
✗ creds.json          (WhatsApp credentials)
✗ auth_info/          (authentication data)
```

---

## 🔍 Verify Security

### Check 1: Console Output

Run your bot and verify tokens are masked:

```bash
npm start
# Should see: TOKEN: ****hidden****
```

### Check 2: Git Status

```bash
git status
# Should NOT show .env file
```

### Check 3: Environment Variables

```bash
echo $TELEGRAM_BOT_TOKEN
# Should be set (not visible in this check)
```

### Check 4: Log Files

Verify logs don't contain sensitive data:

```bash
cat logs/*.log | grep "SESSION_ID"
# Should return nothing or ****hidden****
```

---

## 🎓 Best Practices

### ✅ DO:

- ✅ Use `.env.example` as template
- ✅ Store secrets in Railway variables
- ✅ Regenerate tokens if exposed
- ✅ Use strong, unique phone numbers
- ✅ Check `.gitignore` regularly
- ✅ Review security updates

### ❌ DON'T:

- ❌ Commit `.env` to git
- ❌ Share SESSION_ID publicly
- ❌ Use same token for multiple bots
- ❌ Log sensitive variables
- ❌ Store credentials in code
- ❌ Upload session files to GitHub

---

## 📞 Need Help?

### Common Issues:

| Issue | Solution |
|-------|----------|
| Token not working | Verify TELEGRAM_BOT_TOKEN in Railway |
| Session expired | Generate new SESSION_ID via QR or phone |
| Bot offline | Check Railway logs |
| Commands not working | Verify BOT_PREFIX (default: `.`) |
| Connection refused | Ensure SESSION_ID is valid base64 |

### Support Resources:

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Baileys Documentation](https://github.com/WhiskeySockets/Baileys)
- [Railway Docs](https://docs.railway.app)

---

## ✨ Your Security Is Maximum!

- 🔒 SESSION_ID: **HIDDEN**
- 🔒 TELEGRAM_BOT_TOKEN: **HIDDEN**
- 🔒 Console Logs: **SANITIZED**
- 🔒 Git Repository: **PROTECTED**

**You're all set!** 🎉

---

*Last Updated: 2026-06-06*
*Security Level: 🟢 MAXIMUM*
*Status: All credentials protected*
