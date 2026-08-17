const express = require("express");
const P = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const PREFIX = ".";

const SESSION_DIR = path.join(__dirname, "sessions");

if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

let sock = null;
let pairingCode = null;
let botStatus = "OFFLINE";
let reconnecting = false;

// ================================
// WEB SERVER - RENDER
// ================================

app.get("/", (req, res) => {
  res.json({
    bot: "KIM-DOLCE-MD",
    status: botStatus,
    whatsapp: sock ? "CONNECTED" : "DISCONNECTED"
  });
});

app.get("/status", (req, res) => {
  res.json({
    bot: "KIM-DOLCE-MD",
    status: botStatus,
    pairingCode: pairingCode || null,
    connected: !!sock
  });
});

// ================================
// PAIRING CODE
// ================================
//
// Exemple:
// /pair?number=509XXXXXXXX
//
// N'utilise PAS le signe +
// ================================

app.get("/pair", async (req, res) => {
  try {
    const number = String(req.query.number || "")
      .replace(/\D/g, "");

    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Mete nimewo WhatsApp la. Egzanp: /pair?number=509XXXXXXXX"
      });
    }

    if (number.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Nimewo a pa sanble valid."
      });
    }

    if (!sock) {
      return res.status(503).json({
        success: false,
        message: "WhatsApp poko pare. Tann kèk segonn epi eseye ankò."
      });
    }

    if (sock.authState?.creds?.registered) {
      return res.json({
        success: false,
        message: "WhatsApp deja konekte ak yon session."
      });
    }

    pairingCode = await sock.requestPairingCode(number);

    console.log("");
    console.log("======================================");
    console.log(" KIM-DOLCE-MD PAIRING CODE");
    console.log("======================================");
    console.log(" Nimewo :", number);
    console.log(" CODE   :", pairingCode);
    console.log("======================================");
    console.log("");

    return res.json({
      success: true,
      bot: "KIM-DOLCE-MD",
      number,
      pairingCode
    });

  } catch (error) {
    console.error("Pairing error:", error);

    return res.status(500).json({
      success: false,
      message: "Pa kapab kreye pairing code.",
      error: error.message
    });
  }
});

// ================================
// LOGOUT
// ================================

app.get("/logout", async (req, res) => {
  try {
    if (!sock) {
      return res.json({
        success: false,
        message: "Bot la pa konekte."
      });
    }

    await sock.logout();

    sock = null;
    pairingCode = null;
    botStatus = "OFFLINE";

    return res.json({
      success: true,
      message: "KIM-DOLCE-MD dekonekte."
    });

  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// MESSAGE HANDLER
// ================================

async function handleMessage(message) {
  try {
    if (!message || !message.message) return;

    const jid = message.key.remoteJid;

    if (!jid || jid === "status@broadcast") return;

    const messageType = Object.keys(message.message)[0];

    let text = "";

    if (messageType === "conversation") {
      text = message.message.conversation;
    }

    if (messageType === "extendedTextMessage") {
      text = message.message.extendedTextMessage.text;
    }

    if (!text) return;

    text = text.trim();

    console.log(`[MESSAGE] ${jid}: ${text}`);

    // ================================
    // START
    // ================================

    if (text === ".start") {
      await sock.sendMessage(jid, {
        text:
`👋 Bonjou!

🤖 *KIM-DOLCÉ MD*

👑 Owner: KIM DOLCE

Tape *.menu* pou wè tout kòmand yo.`
      });

      return;
    }

    // ================================
    // MENU
    // ================================

    if (text === ".menu") {
      await sock.sendMessage(jid, {
        text:
`╭━━━〔 🤖 KIM-DOLCÉ MD 〕━━━╮
┃
┃ 👑 Owner: KIM DOLCE
┃ ⚡ Prefix: .
┃ 📡 Status: ${botStatus}
┃
┣━━〔 GENERAL 〕━━
┃ .start
┃ .menu
┃ .help
┃ .ping
┃ .alive
┃ .bot
┃ .owner
┃ .id
┃ .info
┃ .time
┃ .date
┃ .status
┃ .logout
┃
┣━━〔 GROUP 〕━━
┃ .tagall
┃ .kickall
┃ .antilink
┃ .antimention
┃ .antidelete
┃
┣━━〔 STATUS 〕━━
┃ .autoview
┃ .autolike
┃
╰━━━━━━━━━━━━━━━━━━╯`
      });

      return;
    }

    // ================================
    // HELP
    // ================================

    if (text === ".help") {
      await sock.sendMessage(jid, {
        text:
`📚 *KIM-DOLCÉ MD HELP*

Tape *.menu* pou wè lis kòmand disponib.

Prefix:
.

Egzanp:
.ping
.alive
.owner
.status`
      });

      return;
    }

    // ================================
    // PING
    // ================================

    if (text === ".ping") {
      const start = Date.now();

      await sock.sendMessage(jid, {
        text: "🏓 PING..."
      });

      const end = Date.now();

      await sock.sendMessage(jid, {
        text: `🏓 PONG!\n⚡ ${end - start} ms`
      });

      return;
    }

    // ================================
    // ALIVE
    // ================================

    if (text === ".alive") {
      await sock.sendMessage(jid, {
        text:
`🟢 *KIM-DOLCÉ MD IS ALIVE*

🤖 Bot: KIM-DOLCÉ MD
📡 Status: ${botStatus}
⚡ Prefix: .
👑 Owner: KIM DOLCE`
      });

      return;
    }

    // ================================
    // BOT
    // ================================

    if (text === ".bot") {
      await sock.sendMessage(jid, {
        text:
`🤖 *KIM-DOLCÉ MD*

WhatsApp Multi-Device Bot

👑 Owner: KIM DOLCE
⚡ Prefix: .
📡 Status: ${botStatus}`
      });

      return;
    }

    // ================================
    // OWNER
    // ================================

    if (text === ".owner") {
      await sock.sendMessage(jid, {
        text:
`👑 *BOT OWNER*

KIM DOLCE

🤖 KIM-DOLCÉ MD`
      });

      return;
    }

    // ================================
    // ID
    // ================================

    if (text === ".id") {
      await sock.sendMessage(jid, {
        text:
`🆔 *CHAT ID*

${jid}`
      });

      return;
    }

    // ================================
    // INFO
    // ================================

    if (text === ".info") {
      await sock.sendMessage(jid, {
        text:
`ℹ️ *KIM-DOLCÉ MD*

🤖 Version: 1.0.0
📡 WhatsApp: ${botStatus}
⚡ Prefix: .
👑 Owner: KIM DOLCE`
      });

      return;
    }

    // ================================
    // TIME
    // ================================

    if (text === ".time") {
      const now = new Date();

      await sock.sendMessage(jid, {
        text: `🕐 Lè aktyèl la: ${now.toLocaleTimeString()}`
      });

      return;
    }

    // ================================
    // DATE
    // ================================

    if (text === ".date") {
      const now = new Date();

      await sock.sendMessage(jid, {
        text: `📅 Dat: ${now.toLocaleDateString()}`
      });

      return;
    }

    // ================================
    // STATUS
    // ================================

    if (text === ".status") {
      await sock.sendMessage(jid, {
        text:
`📡 *BOT STATUS*

🤖 KIM-DOLCÉ MD
🟢 ${botStatus}
📱 WhatsApp: ${sock ? "Connected" : "Disconnected"}`
      });

      return;
    }

    // ================================
    // UNKNOWN COMMAND
    // ================================

    if (text.startsWith(PREFIX)) {
      await sock.sendMessage(jid, {
        text:
`❌ Kòmand sa pa egziste.

Tape *.menu* pou wè kòmand yo.`
      });
    }

  } catch (error) {
    console.error("Message handler error:", error);
  }
}

// ================================
// CONNECT WHATSAPP
// ================================

async function startWhatsApp() {
  try {
    const { state, saveCreds } =
      await useMultiFileAuthState(SESSION_DIR);

    let version;

    try {
      const latest = await fetchLatestBaileysVersion();
      version = latest.version;
    } catch {
      version = undefined;
    }

    sock = makeWASocket({
      auth: state,

      version,

      logger: P({
        level: "silent"
      }),

      printQRInTerminal: false,

      browser: [
        "KIM-DOLCE-MD",
        "Chrome",
        "1.0.0"
      ],

      generateHighQualityLinkPreview: false,

      syncFullHistory: false,

      markOnlineOnConnect: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const {
        connection,
        lastDisconnect
      } = update;

      if (connection === "connecting") {
        botStatus = "CONNECTING";

        console.log("🔄 WhatsApp ap konekte...");
      }

      if (connection === "open") {
        botStatus = "ONLINE";
        reconnecting = false;
        pairingCode = null;

        console.log("");
        console.log("======================================");
        console.log(" 🟢 KIM-DOLCÉ MD ONLINE");
        console.log("======================================");
        console.log("");

        try {
          await sock.sendPresenceUpdate("available");
        } catch {}
      }

      if (connection === "close") {
        botStatus = "OFFLINE";

        const statusCode =
          lastDisconnect?.error?.output?.statusCode;

        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut;

        console.log(
          "❌ WhatsApp connection closed:",
          statusCode
        );

        sock = null;

        if (shouldReconnect && !reconnecting) {
          reconnecting = true;

          console.log(
            "🔄 Rekoneksyon nan 5 segonn..."
          );

          setTimeout(() => {
            startWhatsApp();
          }, 5000);
        } else {
          console.log(
            "⚠️ Session lan dekonekte. Pairing nesesè ankò."
          );
        }
      }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
      for (const message of messages) {
        await handleMessage(message);
      }
    });

  } catch (error) {
    console.error("START WHATSAPP ERROR:", error);

    botStatus = "ERROR";

    if (!reconnecting) {
      reconnecting = true;

      setTimeout(() => {
        reconnecting = false;
        startWhatsApp();
      }, 10000);
    }
  }
}

// ================================
// START SERVER
// ================================

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("======================================");
  console.log(" 🤖 KIM-DOLCÉ MD");
  console.log(" 🌐 Server PORT:", PORT);
  console.log(" 📡 Render Web Service READY");
  console.log("======================================");
  console.log("");

  startWhatsApp();
});
