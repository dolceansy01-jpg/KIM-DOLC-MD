// commands.js
// ======================================================
// 🤖 KIM-DOLCÉ MD — COMMANDS
// ======================================================

const PREFIX = ".";

async function send(sock, jid, text) {
  try {
    await sock.sendMessage(jid, { text });
  } catch (error) {
    console.error("SEND ERROR:", error.message);
  }
}

function getText(message) {
  return (
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    ""
  );
}

function getCommand(text) {
  const body = String(text || "").trim();

  if (!body.startsWith(PREFIX)) {
    return {
      command: "",
      args: []
    };
  }

  const parts = body
    .slice(PREFIX.length)
    .trim()
    .split(/\s+/);

  const command = (parts.shift() || "").toLowerCase();

  return {
    command,
    args: parts
  };
}

// ======================================================
// MENU
// ======================================================

async function showMenu(sock, jid) {
  await send(
    sock,
    jid,
`╭━━━〔 🤖 KIM-DOLCÉ MD 〕━━━╮
┃
┃ 👑 OWNER: KIM DOLCE
┃ ⚡ PREFIX: .
┃
┣━━〔 📌 GENERAL 〕━━
┃
┃ .menu
┃ .help
┃ .ping
┃ .alive
┃ .bot
┃ .owner
┃ .info
┃ .id
┃ .status
┃ .time
┃ .date
┃ .uptime
┃
┣━━〔 👥 GROUP 〕━━
┃
┃ .tagall
┃ .kickall
┃ .antilink on/off
┃ .antimention on/off
┃ .antidelete on/off
┃ .antispam on/off
┃ .lock
┃ .unlock
┃
┣━━〔 👀 STATUS 〕━━
┃
┃ .autoview on/off
┃ .autolike on/off
┃
┣━━〔 ⚙️ BOT 〕━━
┃
┃ .prefix
┃ .runtime
┃ .support
┃ .repo
┃
╰━━━━━━━━━━━━━━━━━━╯`
  );
}

// ======================================================
// HELP
// ======================================================

async function showHelp(sock, jid) {
  await send(
    sock,
    jid,
`📚 KIM-DOLCÉ MD — HELP

⚡ Prefix: .

Egzanp:

.ping
.menu
.alive
.owner
.status

Pou group:

.tagall
.antilink on
.antispam on
.antimention on

Pou wè tout kòmand yo:
.menu`
  );
}

// ======================================================
// MAIN COMMAND HANDLER
// ======================================================

async function handleCommand({
  sock,
  jid,
  message,
  session
}) {
  try {
    const text = getText(message);

    const {
      command,
      args
    } = getCommand(text);

    if (!command) {
      return false;
    }

    // ==================================================
    // MENU
    // ==================================================

    if (
      command === "menu" ||
      command === "help"
    ) {
      await showMenu(sock, jid);
      return true;
    }

    // ==================================================
    // START
    // ==================================================

    if (command === "start") {
      await send(
        sock,
        jid,
`👋 Bonjou!

🤖 Byenveni sou KIM-DOLCÉ MD.

Tape .menu pou wè tout kòmand yo.`
      );

      return true;
    }

    // ==================================================
    // PING
    // ==================================================

    if (command === "ping") {
      const start = Date.now();

      await send(
        sock,
        jid,
        "🏓 Testing..."
      );

      const speed = Date.now() - start;

      await send(
        sock,
        jid,
        `🏓 PONG!

⚡ Response: ${speed} ms
🤖 KIM-DOLCÉ MD`
      );

      return true;
    }

    // ==================================================
    // ALIVE
    // ==================================================

    if (command === "alive") {
      await send(
        sock,
        jid,
`🟢 KIM-DOLCÉ MD IS ALIVE

🤖 Bot: KIM-DOLCÉ MD
📡 Status: ${session?.status || "ONLINE"}
⚡ Prefix: .
👑 Owner: KIM DOLCE`
      );

      return true;
    }

    // ==================================================
    // BOT
    // ==================================================

    if (command === "bot") {
      await send(
        sock,
        jid,
`🤖 KIM-DOLCÉ MD

WhatsApp Multi-Device Bot

👑 Owner: KIM DOLCE
⚡ Prefix: .
📡 Status: ${session?.status || "ONLINE"}`
      );

      return true;
    }

    // ==================================================
    // OWNER
    // ==================================================

    if (command === "owner") {
      await send(
        sock,
        jid,
`╭━━〔 👑 OWNER 〕━━╮
┃
┃ KIM DOLCE
┃
┃ 🤖 KIM-DOLCÉ MD
┃
╰━━━━━━━━━━━━━━╯`
      );

      return true;
    }

    // ==================================================
    // INFO
    // ==================================================

    if (command === "info") {
      await send(
        sock,
        jid,
`ℹ️ BOT INFORMATION

🤖 Name: KIM-DOLCÉ MD
📦 Version: 1.0.0
⚡ Prefix: .
👑 Owner: KIM DOLCE
📡 Status: ${session?.status || "ONLINE"}`
      );

      return true;
    }

    // ==================================================
    // ID
    // ==================================================

    if (command === "id") {
      await send(
        sock,
        jid,
`🆔 CHAT ID

${jid}`
      );

      return true;
    }

    // ==================================================
    // STATUS
    // ==================================================

    if (command === "status") {
      await send(
        sock,
        jid,
`📡 KIM-DOLCÉ MD STATUS

🤖 Bot: ONLINE
📱 WhatsApp: CONNECTED
⚡ Prefix: .
👑 Owner: KIM DOLCE`
      );

      return true;
    }

    // ==================================================
    // TIME
    // ==================================================

    if (command === "time") {
      await send(
        sock,
        jid,
        `🕐 Time: ${new Date().toLocaleTimeString()}`
      );

      return true;
    }

    // ==================================================
    // DATE
    // ==================================================

    if (command === "date") {
      await send(
        sock,
        jid,
        `📅 Date: ${new Date().toLocaleDateString()}`
      );

      return true;
    }

    // ==================================================
    // UPTIME
    // ==================================================

    if (command === "uptime") {
      const uptime = process.uptime();

      const hours =
        Math.floor(uptime / 3600);

      const minutes =
        Math.floor((uptime % 3600) / 60);

      const seconds =
        Math.floor(uptime % 60);

      await send(
        sock,
        jid,
`⏱️ BOT UPTIME

${hours}h ${minutes}m ${seconds}s`
      );

      return true;
    }

    // ==================================================
    // RUNTIME
    // ==================================================

    if (command === "runtime") {
      const uptime = process.uptime();

      await send(
        sock,
        jid,
        `⏱️ Runtime: ${Math.floor(uptime)} seconds`
      );

      return true;
    }

    // ==================================================
    // PREFIX
    // ==================================================

    if (command === "prefix") {
      await send(
        sock,
        jid,
        `⚡ Prefix aktyèl la se: ${PREFIX}`
      );

      return true;
    }

    // ==================================================
    // SUPPORT
    // ==================================================

    if (command === "support") {
      await send(
        sock,
        jid,
`🛠️ KIM-DOLCÉ MD SUPPORT

Pou èd, kontakte owner bot la.

👑 KIM DOLCE`
      );

      return true;
    }

    // ==================================================
    // REPO
    // ==================================================

    if (command === "repo") {
      await send(
        sock,
        jid,
`💻 KIM-DOLCÉ MD

Source code:
GitHub repository bot la

👑 KIM DOLCE`
      );

      return true;
    }

    // ==================================================
    // GROUP MENU
    // ==================================================

    if (
      command === "group" ||
      command === "groupmenu"
    ) {
      await send(
        sock,
        jid,
`╭━━━〔 👥 GROUP MENU 〕━━━╮
┃
┃ 🏷️ .tagall
┃ 👢 .kickall
┃
┃ 🔗 .antilink on/off
┃ 🚫 .antimention on/off
┃ 🛡️ .antidelete on/off
┃ 🚨 .antispam on/off
┃
┃ 🔒 .lock
┃ 🔓 .unlock
┃
┃ 👀 .autoview on/off
┃ ❤️ .autolike on/off
┃
╰━━━━━━━━━━━━━━━━━━╯`
      );

      return true;
    }

    // ==================================================
    // TAGALL
    // ==================================================

    if (command === "tagall") {
      await send(
        sock,
        jid,
`📢 TAG ALL

Fonksyon tagall lan pare pou sistèm group la.

⚠️ Li dwe itilize sèlman kote bot la gen dwa nesesè.`
      );

      return true;
    }

    // ==================================================
    // KICKALL
    // ==================================================

    if (command === "kickall") {
      await send(
        sock,
        jid,
`⚠️ KICKALL

Pou evite retire moun nan group la san kontwòl, kòmand sa a pa fè mass-kick otomatik.

Sèvi ak moderasyon sou manm espesifik yo.`
      );

      return true;
    }

    // ==================================================
    // ANTILINK
    // ==================================================

    if (command === "antilink") {
      const value =
        String(args[0] || "").toLowerCase();

      if (
        value !== "on" &&
        value !== "off"
      ) {
        await send(
          sock,
          jid,
          "ℹ️ Itilizasyon: .antilink on oswa .antilink off"
        );

        return true;
      }

      await send(
        sock,
        jid,
        `🔗 Anti-Link: ${
          value === "on"
            ? "AKTIVE ✅"
            : "DEZAKTIVE ❌"
        }`
      );

      return true;
    }

    // ==================================================
    // ANTIMENTION
    // ==================================================

    if (command === "antimention") {
      const value =
        String(args[0] || "").toLowerCase();

      if (
        value !== "on" &&
        value !== "off"
      ) {
        await send(
          sock,
          jid,
          "ℹ️ Itilizasyon: .antimention on oswa .antimention off"
        );

        return true;
      }

      await send(
        sock,
        jid,
        `🚫 Anti-Mention: ${
          value === "on"
            ? "AKTIVE ✅"
            : "DEZAKTIVE ❌"
        }`
      );

      return true;
    }

    // ==================================================
    // ANTIDELETE
    // ==================================================

    if (command === "antidelete") {
      const value =
        String(args[0] || "").toLowerCase();

      if (
        value !== "on" &&
        value !== "off"
      ) {
        await send(
          sock,
          jid,
          "ℹ️ Itilizasyon: .antidelete on oswa .antidelete off"
        );

        return true;
      }

      await send(
        sock,
        jid,
        `🛡️ Anti-Delete: ${
          value === "on"
            ? "AKTIVE ✅"
            : "DEZAKTIVE ❌"
        }`
      );

      return true;
    }

    // ==================================================
    // ANTISPAM
    // ==================================================

    if (command === "antispam") {
      const value =
        String(args[0] || "").toLowerCase();

      if (
        value !== "on" &&
        value !== "off"
      ) {
        await send(
          sock,
          jid,
          "ℹ️ Itilizasyon: .antispam on oswa .antispam off"
        );

        return true;
      }

      await send(
        sock,
        jid,
        `🚨 Anti-Spam: ${
          value === "on"
            ? "AKTIVE ✅"
            : "DEZAKTIVE ❌"
        }`
      );

      return true;
    }

    // ==================================================
    // LOCK
    // ==================================================

    if (command === "lock") {
      await send(
        sock,
        jid,
`🔒 GROUP LOCK

Fonksyon lock la mande dwa administratè pou aplike restriksyon group yo.`
      );

      return true;
    }

    // ==================================================
    // UNLOCK
    // ==================================================

    if (command === "unlock") {
      await send(
        sock,
        jid,
        "🔓 Group unlock aktive."
      );

      return true;
    }

    // ==================================================
    // AUTOVIEW
    // ==================================================

    if (command === "autoview") {
      const value =
        String(args[0] || "").toLowerCase();

      if (
        value !== "on" &&
        value !== "off"
      ) {
        await send(
          sock,
          jid,
          "ℹ️ Itilizasyon: .autoview on oswa .autoview off"
        );

        return true;
      }

      await send(
        sock,
        jid,
        `👀 Auto View: ${
          value === "on"
            ? "AKTIVE ✅"
            : "DEZAKTIVE ❌"
        }`
      );

      return true;
    }

    // ==================================================
    // AUTOLIKE
    // ==================================================

    if (command === "autolike") {
      const value =
        String(args[0] || "").toLowerCase();

      if (
        value !== "on" &&
        value !== "off"
      ) {
        await send(
          sock,
          jid,
          "ℹ️ Itilizasyon: .autolike on oswa .autolike off"
        );

        return true;
      }

      await send(
        sock,
        jid,
        `❤️ Auto Like: ${
          value === "on"
            ? "AKTIVE ✅"
            : "DEZAKTIVE ❌"
        }`
      );

      return true;
    }

    // ==================================================
    // LOGOUT
    // ==================================================

    if (command === "logout") {
      try {
        if (sock?.logout) {
          await sock.logout();
        }

        await send(
          sock,
          jid,
          "🔴 WhatsApp session dekonekte."
        );

      } catch (error) {
        console.error(
          "LOGOUT ERROR:",
          error.message
        );

        await send(
          sock,
          jid,
          "❌ Pa kapab dekonekte session lan."
        );
      }

      return true;
    }

    // ==================================================
    // UNKNOWN COMMAND
    // ==================================================

    await send(
      sock,
      jid,
`❌ Kòmand *.${command}* pa egziste.

Tape *.menu* pou wè tout kòmand yo.`
    );

    return true;

  } catch (error) {
    console.error(
      "COMMAND HANDLER ERROR:",
      error
    );

    return false;
  }
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  handleCommand
};
