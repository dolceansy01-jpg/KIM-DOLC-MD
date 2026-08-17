const express = require("express");
const fs = require("fs");
const path = require("path");
const P = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const TelegramBot = require("node-telegram-bot-api");

// =====================================================
// CONFIG
// =====================================================

const PORT = process.env.PORT || 10000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const OWNER_NAME = "KIM DOLCE";
const BOT_NAME = "KIM-DOLC-MD";

const SESSION_DIR = path.join(__dirname, "session");

if (!TELEGRAM_BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN pa defini.");
  console.error("Mete token BotFather la nan Render Environment Variables.");
  process.exit(1);
}

// =====================================================
// FOLDERS
// =====================================================

if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

// =====================================================
// EXPRESS SERVER
// =====================================================

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    bot: BOT_NAME,
    owner: OWNER_NAME,
    telegram: "online",
    whatsapp: waConnected ? "connected" : "disconnected"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    telegram: true,
    whatsapp: waConnected
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Server started on port ${PORT}`);
});

// =====================================================
// TELEGRAM
// =====================================================

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true
});

console.log("🤖 Telegram bot started");

// =====================================================
// WHATSAPP VARIABLES
// =====================================================

let sock = null;
let waConnected = false;
let pairingInProgress = false;

// =====================================================
// USERS
// =====================================================

const allowedUsers = new Set();

// Si ou vle sèlman ou menm sèvi ak /pair,
// mete TELEGRAM_OWNER_ID nan Render.
// Egzanp: 123456789
const OWNER_ID = process.env.TELEGRAM_OWNER_ID
  ? String(process.env.TELEGRAM_OWNER_ID)
  : null;

function isOwner(msg) {
  if (!OWNER_ID) return true;
  return String(msg.from.id) === OWNER_ID;
}

// =====================================================
// HELPERS
// =====================================================

function cleanPhone(number) {
  return String(number || "").replace(/\D/g, "");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function menuText() {
  return `
╭━━━━━━━━━━━━━━━━━━━━╮
      🤖 ${BOT_NAME}
╰━━━━━━━━━━━━━━━━━━━━╯

👑 Owner: ${OWNER_NAME}

📱 WHATSAPP
• /pair 509XXXXXXXX
• /status
• /logout

🤖 TELEGRAM
• /start
• /menu
• /help
• /ping
• /alive
• /id
• /info

📌 WHATSAPP COMMANDS

• .menu
• .help
• .ping
• .alive
• .owner
• .bot
• .status

👥 GROUP
• .tagall
• .kickall
• .antilink
• .antispam
• .antimention

⚙️ SYSTEM
• .uptime
• .time
• .date

⚡ Prefix WhatsApp: .
⚡ Prefix Telegram: /

━━━━━━━━━━━━━━━━━━━━
🔥 ${BOT_NAME}
`;
}

// =====================================================
// TELEGRAM /START
// =====================================================

bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    `👋 Bonjou ${msg.from.first_name || "KIM"}!

🤖 *${BOT_NAME}*

👑 Owner: ${OWNER_NAME}

Bot la pare.

Tape /menu pou wè tout kòmand yo.

Pou konekte WhatsApp:
\`/pair 509XXXXXXXX\``,
    {
      parse_mode: "Markdown"
    }
  );
});

// =====================================================
// TELEGRAM /MENU
// =====================================================

bot.onText(/^\/menu$/, async (msg) => {
  await bot.sendMessage(msg.chat.id, menuText());
});

// =====================================================
// TELEGRAM /HELP
// =====================================================

bot.onText(/^\/help$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `🛠️ *${BOT_NAME}*

Kòmand prensipal yo:

/pair 509XXXXXXXX
/status
/logout
/menu
/ping
/alive
/id
/info

📱 Egzanp:

/pair 50941123456`,
    {
      parse_mode: "Markdown"
    }
  );
});

// =====================================================
// TELEGRAM /PING
// =====================================================

bot.onText(/^\/ping$/, async (msg) => {
  const start = Date.now();

  const message = await bot.sendMessage(
    msg.chat.id,
    "🏓 Pinging..."
  );

  const latency = Date.now() - start;

  await bot.editMessageText(
    `🏓 Pong!\n⚡ Latency: ${latency} ms`,
    {
      chat_id: msg.chat.id,
      message_id: message.message_id
    }
  );
});

// =====================================================
// TELEGRAM /ALIVE
// =====================================================

bot.onText(/^\/alive$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `✅ ${BOT_NAME} ap mache.

🤖 Telegram: ONLINE
📱 WhatsApp: ${waConnected ? "ONLINE" : "OFFLINE"}

👑 Owner: ${OWNER_NAME}`
  );
});

// =====================================================
// TELEGRAM /ID
// =====================================================

bot.onText(/^\/id$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `🆔 Chat ID: ${msg.chat.id}

👤 User ID: ${msg.from.id}`
  );
});

// =====================================================
// TELEGRAM /INFO
// =====================================================

bot.onText(/^\/info$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `🤖 BOT INFO

Name: ${BOT_NAME}
Owner: ${OWNER_NAME}

Telegram: ONLINE
WhatsApp: ${waConnected ? "CONNECTED" : "DISCONNECTED"}

Node.js: ${process.version}`
  );
});

// =====================================================
// TELEGRAM /STATUS
// =====================================================

bot.onText(/^\/status$/, async (msg) => {
  const status = waConnected
    ? "🟢 WhatsApp CONNECTED"
    : "🔴 WhatsApp DISCONNECTED";

  await bot.sendMessage(
    msg.chat.id,
    `📊 STATUS

🤖 Telegram: 🟢 ONLINE
📱 WhatsApp: ${status}

Pairing: ${
      pairingInProgress
        ? "⏳ An cours"
        : "✅ Pa gen pairing kounye a"
    }`
  );
});

// =====================================================
// TELEGRAM /PAIR
// =====================================================

bot.onText(/^\/pair(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!isOwner(msg)) {
    return bot.sendMessage(
      chatId,
      "❌ Ou pa gen pèmisyon pou itilize /pair."
    );
  }

  const number = cleanPhone(match && match[1]);

  if (!number) {
    return bot.sendMessage(
      chatId,
      `📱 Mete nimewo WhatsApp la.

Egzanp:
\`/pair 50941123456\``,
      {
        parse_mode: "Markdown"
      }
    );
  }

  if (number.length < 8) {
    return bot.sendMessage(
      chatId,
      "❌ Nimewo a pa sanble valid."
    );
  }

  if (pairingInProgress) {
    return bot.sendMessage(
      chatId,
      "⏳ Gen yon pairing ki deja an cours. Tann kèk segond."
    );
  }

  try {
    pairingInProgress = true;

    await bot.sendMessage(
      chatId,
      `⏳ Preparasyon WhatsApp pou:

📱 ${number}

Tanpri tann...`
    );

    const code = await requestWhatsAppPairing(number);

    await bot.sendMessage(
      chatId,
      `🔐 *PAIRING CODE*

\`${code}\`

📱 Nimewo: ${number}

WhatsApp →
Linked devices →
Link a device →
Link with phone number instead

Apre sa antre kòd la.`,
      {
        parse_mode: "Markdown"
      }
    );

  } catch (error) {
    console.error("PAIR ERROR:", error);

    await bot.sendMessage(
      chatId,
      `❌ Pairing echwe.

Erè:
${error.message || error}`
    );
  } finally {
    pairingInProgress = false;
  }
});

// =====================================================
// REQUEST WHATSAPP PAIRING CODE
// =====================================================

async function requestWhatsAppPairing(phoneNumber) {

  if (!sock) {
    await startWhatsApp();
  }

  await sleep(3000);

  const code = await sock.requestPairingCode(phoneNumber);

  return code;
}

// =====================================================
// START WHATSAPP
// =====================================================

async function startWhatsApp() {

  const { state, saveCreds } =
    await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth: state,

    logger: P({
      level: "silent"
    }),

    printQRInTerminal: false,

    browser: [
      "KIM-DOLC-MD",
      "Chrome",
      "1.0.0"
    ],

    markOnlineOnConnect: true
  });

  sock.ev.on(
    "creds.update",
    saveCreds
  );

  sock.ev.on(
    "connection.update",
    async (update) => {

      const {
        connection,
        lastDisconnect
      } = update;

      console.log(
        "WhatsApp connection:",
        connection
      );

      if (connection === "open") {

        waConnected = true;

        console.log(
          "✅ WhatsApp CONNECTED"
        );
      }

      if (connection === "close") {

        waConnected = false;

        const statusCode =
          lastDisconnect?.error?.output?.statusCode;

        console.log(
          "❌ WhatsApp disconnected:",
          statusCode
        );

        if (
          statusCode !== DisconnectReason.loggedOut
        ) {

          console.log(
            "🔄 Reconnecting WhatsApp..."
          );

          await sleep(3000);

          try {
            await startWhatsApp();
          } catch (err) {
            console.error(
              "Reconnect error:",
              err
            );
          }

        } else {

          console.log(
            "🚪 WhatsApp session logged out."
          );
        }
      }
    }
  );

  sock.ev.on(
    "messages.upsert",
    async ({ messages }) => {

      const message = messages[0];

      if (!message || !message.message) {
        return;
      }

      await handleWhatsAppMessage(
        message
      );
    }
  );
}

// =====================================================
// WHATSAPP MESSAGE HANDLER
// =====================================================

async function handleWhatsAppMessage(msg) {

  try {

    const remoteJid =
      msg.key.remoteJid;

    if (!remoteJid) return;

    if (msg.key.fromMe) return;

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      "";

    if (!text) return;

    console.log(
      `📩 ${remoteJid}: ${text}`
    );

    // -------------------------------------------------
    // MENU
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".menu" ||
      text.toLowerCase() === ".help"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text: menuText()
        }
      );

      return;
    }

    // -------------------------------------------------
    // PING
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".ping"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text: "🏓 Pong!\n⚡ KIM-DOLC-MD ONLINE"
        }
      );

      return;
    }

    // -------------------------------------------------
    // ALIVE
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".alive"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `✅ ${BOT_NAME} ONLINE\n\n` +
            `👑 Owner: ${OWNER_NAME}\n` +
            `📱 WhatsApp: ONLINE\n` +
            `🤖 Telegram: ONLINE`
        }
      );

      return;
    }

    // -------------------------------------------------
    // BOT
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".bot"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `🤖 ${BOT_NAME}\n\n` +
            `👑 Owner: ${OWNER_NAME}\n` +
            `⚡ WhatsApp Bot`
        }
      );

      return;
    }

    // -------------------------------------------------
    // OWNER
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".owner"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `👑 OWNER\n\n` +
            `${OWNER_NAME}`
        }
      );

      return;
    }

    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".status"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `📊 STATUS\n\n` +
            `📱 WhatsApp: ${
              waConnected
                ? "🟢 ONLINE"
                : "🔴 OFFLINE"
            }\n` +
            `🤖 Telegram: 🟢 ONLINE`
        }
      );

      return;
    }

    // -------------------------------------------------
    // UPTIME
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".uptime"
    ) {

      const seconds =
        Math.floor(
          process.uptime()
        );

      const hours =
        Math.floor(seconds / 3600);

      const minutes =
        Math.floor(
          (seconds % 3600) / 60
        );

      const secs =
        seconds % 60;

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `⏱️ UPTIME\n\n` +
            `${hours}h ${minutes}m ${secs}s`
        }
      );

      return;
    }

    // -------------------------------------------------
    // TIME
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".time"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `🕐 ${new Date().toLocaleTimeString(
              "fr-FR",
              {
                timeZone:
                  "America/Port-au-Prince"
              }
            )}`
        }
      );

      return;
    }

    // -------------------------------------------------
    // DATE
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".date"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `📅 ${new Date().toLocaleDateString(
              "fr-FR",
              {
                timeZone:
                  "America/Port-au-Prince"
              }
            )}`
        }
      );

      return;
    }

    // -------------------------------------------------
    // ID
    // -------------------------------------------------

    if (
      text.toLowerCase() === ".id"
    ) {

      await sock.sendMessage(
        remoteJid,
        {
          text:
            `🆔 JID:\n${remoteJid}`
        }
      );

      return;
    }

  } catch (error) {

    console.error(
      "WhatsApp message error:",
      error
    );
  }
}

// =====================================================
// TELEGRAM /LOGOUT
// =====================================================

bot.onText(/^\/logout$/, async (msg) => {

  const chatId = msg.chat.id;

  if (!isOwner(msg)) {
    return bot.sendMessage(
      chatId,
      "❌ Ou pa gen pèmisyon pou fè logout."
    );
  }

  try {

    if (!sock) {

      return bot.sendMessage(
        chatId,
        "ℹ️ WhatsApp pa konekte."
      );
    }

    await sock.logout();

    waConnected = false;

    await bot.sendMessage(
      chatId,
      "✅ WhatsApp session dekonekte."
    );

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

    await bot.sendMessage(
      chatId,
      `❌ Logout echwe:\n${error.message}`
    );
  }
});

// =====================================================
// TELEGRAM ERRORS
// =====================================================

bot.on("polling_error", (error) => {
  console.error(
    "Telegram polling error:",
    error.message
  );
});

// =====================================================
// START
// =====================================================

console.log(`
╭──────────────────────────────╮
│       ${BOT_NAME}
│       ${OWNER_NAME}
╰──────────────────────────────╯

🤖 Telegram: STARTING
📱 WhatsApp: STARTING
🌐 Port: ${PORT}
`);

startWhatsApp()
  .then(() => {
    console.log(
      "✅ WhatsApp system initialized"
    );
  })
  .catch((error) => {
    console.error(
      "❌ WhatsApp initialization error:",
      error
    );
  });
