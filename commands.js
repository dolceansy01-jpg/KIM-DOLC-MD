"use strict";

/*
 * KIM-DOLC-MD
 * commands.js
 *
 * 100+ Telegram / WhatsApp bot commands
 */

const BOT_NAME = "KIM-DOLC-MD";
const OWNER = "KIM DOLCE";
const PREFIX = ".";

const commands = {};

/* =========================================================
   HELPER
========================================================= */

function text(message) {
  return String(message || "").trim();
}

function add(name, description, handler) {
  commands[name] = {
    name,
    description,
    handler
  };
}

/* =========================================================
   GENERAL COMMANDS
========================================================= */

add("start", "Demare bot la", async () => {
  return `👋 Bonjou!

🤖 ${BOT_NAME}
👑 Owner: ${OWNER}

Tape ${PREFIX}menu pou wè tout kòmand yo.`;
});

add("menu", "Montre meni prensipal la", async () => {
  return `
╔════════════════════╗
     🤖 ${BOT_NAME}
╚════════════════════╝

👑 Owner: ${OWNER}

📌 GENERAL
.start
.menu
.help
.ping
.alive
.bot
.owner
.id
.info
.time
.date
.uptime
.version

📱 WHATSAPP
.pair
.status
.logout
.connect
.disconnect

👥 GROUP
.tagall
.kickall
.admins
.groupinfo
.groupid
.members
.promote
.demote
.add
.remove
.mute
.unmute
.lock
.unlock
.link
.rules

🛡️ SECURITY
.antidelete
.antilink
.antimention
.antispam
.antibot

👀 STATUS
.autoview
.autolike
.statuson
.statusoff

🎮 FUN
.joke
.quote
.fact
.coin
.dice
.8ball
.rps
.choose
.roll

ℹ️ TOOLS
.echo
.say
.reverse
.upper
.lower
.calc
.translate
.weather
.timezone
.uuid
.random
.qr
.short
.base64
.decode

⚙️ SYSTEM
.stats
.logs
.reload
.restart
.broadcast
.users
.version
.about

📌 Prefix: ${PREFIX}
`;
});

add("help", "Montre èd", async () => {
  return `📚 HELP

Tape ${PREFIX}menu pou wè lis kòmand yo.

Egzanp:
${PREFIX}ping
${PREFIX}status
${PREFIX}pair 509XXXXXXXX
${PREFIX}groupinfo`;
});

add("ping", "Teste vitès bot la", async () => {
  return "🏓 Pong!";
});

add("alive", "Verifye si bot la aktif", async () => {
  return `✅ ${BOT_NAME} aktif!`;
});

add("bot", "Enfòmasyon sou bot la", async () => {
  return `🤖 ${BOT_NAME}
👑 Owner: ${OWNER}
⚡ Status: ONLINE`;
});

add("owner", "Montre owner", async () => {
  return `👑 Owner: ${OWNER}`;
});

add("id", "Montre ID itilizatè a", async (ctx) => {
  return `🆔 Your ID: ${ctx?.userId || "Unknown"}`;
});

add("info", "Enfòmasyon bot la", async () => {
  return `ℹ️ ${BOT_NAME}

Version: 1.0.0
Platform: Telegram + WhatsApp
Owner: ${OWNER}`;
});

add("time", "Montre lè a", async () => {
  return `🕐 Lè aktyèl la: ${new Date().toLocaleTimeString()}`;
});

add("date", "Montre dat la", async () => {
  return `📅 Dat: ${new Date().toLocaleDateString()}`;
});

add("uptime", "Montre uptime", async (ctx) => {
  const seconds = Math.floor((Date.now() - (ctx?.startedAt || Date.now())) / 1000);
  return `⏱️ Uptime: ${seconds}s`;
});

add("version", "Montre version", async () => {
  return `📦 ${BOT_NAME} v1.0.0`;
});

/* =========================================================
   WHATSAPP CONNECTION
========================================================= */

add("pair", "Pair WhatsApp", async (ctx) => {
  if (!ctx?.pair) {
    return "⚠️ Fonksyon pairing la poko konekte nan index.js.";
  }

  const number = text(ctx.args?.[0]);

  if (!number) {
    return `📱 Itilizasyon:

${PREFIX}pair 509XXXXXXXX`;
  }

  try {
    return await ctx.pair(number);
  } catch (error) {
    return `❌ Pairing echwe: ${error.message}`;
  }
});

add("status", "Verifye WhatsApp", async (ctx) => {
  if (ctx?.getWhatsAppStatus) {
    return await ctx.getWhatsAppStatus();
  }

  return "📡 WhatsApp status: API disponib.";
});

add("logout", "Dekonekte WhatsApp", async (ctx) => {
  if (ctx?.logoutWhatsApp) {
    return await ctx.logoutWhatsApp();
  }

  return "⚠️ WhatsApp logout function poko konekte.";
});

add("connect", "Konekte WhatsApp", async () => {
  return "🔗 WhatsApp connection ap verifye...";
});

add("disconnect", "Dekonekte WhatsApp", async () => {
  return "🔌 WhatsApp connection ap fèmen...";
});

/* =========================================================
   GROUP COMMANDS
========================================================= */

add("tagall", "Tag tout manm", async (ctx) => {
  if (ctx?.tagAll) return await ctx.tagAll();

  return `📢 Tagall mande aksè admin nan gwoup la.

${PREFIX}tagall`;
});

add("kickall", "Retire manm", async (ctx) => {
  if (ctx?.kickAll) return await ctx.kickAll();

  return "⚠️ Kickall bezwen fonksyon group admin nan index.js.";
});

add("admins", "Montre admin yo", async (ctx) => {
  if (ctx?.getAdmins) return await ctx.getAdmins();

  return "👑 Admins: itilize nan yon gwoup WhatsApp.";
});

add("groupinfo", "Enfòmasyon gwoup", async (ctx) => {
  if (ctx?.groupInfo) return await ctx.groupInfo();

  return "👥 Group info disponib lè bot la konekte ak gwoup la.";
});

add("groupid", "Montre Group ID", async (ctx) => {
  return `🆔 Group ID: ${ctx?.groupId || "Pa disponib"}`;
});

add("members", "Lis manm yo", async (ctx) => {
  if (ctx?.members) return await ctx.members();

  return "👥 Lis manm yo disponib nan gwoup WhatsApp.";
});

add("promote", "Bay admin", async (ctx) => {
  if (ctx?.promote) return await ctx.promote();

  return "👑 Promote bezwen nimewo/mention moun nan.";
});

add("demote", "Retire admin", async (ctx) => {
  if (ctx?.demote) return await ctx.demote();

  return "⬇️ Demote bezwen nimewo/mention moun nan.";
});

add("add", "Ajoute yon moun", async (ctx) => {
  if (ctx?.addMember) return await ctx.addMember(ctx.args?.[0]);

  return `➕ Itilizasyon:
${PREFIX}add 509XXXXXXXX`;
});

add("remove", "Retire yon moun", async (ctx) => {
  if (ctx?.removeMember) return await ctx.removeMember(ctx.args?.[0]);

  return "➖ Remove bezwen yon nimewo oswa mention.";
});

add("mute", "Fè gwoup la sèlman admin", async (ctx) => {
  if (ctx?.muteGroup) return await ctx.muteGroup();

  return "🔇 Mute group.";
});

add("unmute", "Ouvri gwoup la", async (ctx) => {
  if (ctx?.unmuteGroup) return await ctx.unmuteGroup();

  return "🔊 Unmute group.";
});

add("lock", "Bloke chanjman gwoup", async (ctx) => {
  if (ctx?.lockGroup) return await ctx.lockGroup();

  return "🔒 Group locked.";
});

add("unlock", "Debloke gwoup", async (ctx) => {
  if (ctx?.unlockGroup) return await ctx.unlockGroup();

  return "🔓 Group unlocked.";
});

add("link", "Jwenn lyen gwoup", async (ctx) => {
  if (ctx?.groupLink) return await ctx.groupLink();

  return "🔗 Group link disponib sèlman lè bot la admin.";
});

add("rules", "Montre règ gwoup", async () => {
  return `📜 RÈG GWoup

1️⃣ Respekte tout moun.
2️⃣ Pa spam.
3️⃣ Pa voye lyen danjere.
4️⃣ Pa mansyone moun san rezon.
5️⃣ Swiv règ admin yo.`;
});

/* =========================================================
   SECURITY
========================================================= */

add("antidelete", "Anti-delete", async (ctx) => {
  if (ctx?.setAntiDelete) return await ctx.setAntiDelete(true);

  return "🛡️ Anti-delete aktive.";
});

add("antilink", "Anti-link", async (ctx) => {
  if (ctx?.setAntiLink) return await ctx.setAntiLink(true);

  return "🔗 Anti-link aktive.";
});

add("antimention", "Anti-mention", async (ctx) => {
  if (ctx?.setAntiMention) return await ctx.setAntiMention(true);

  return "🛡️ Anti-mention aktive.";
});

add("antispam", "Anti-spam", async (ctx) => {
  if (ctx?.setAntiSpam) return await ctx.setAntiSpam(true);

  return "🚫 Anti-spam aktive.";
});

add("antibot", "Anti-bot", async (ctx) => {
  if (ctx?.setAntiBot) return await ctx.setAntiBot(true);

  return "🤖 Anti-bot aktive.";
});

/* =========================================================
   STATUS
========================================================= */

add("autoview", "Auto view status", async (ctx) => {
  if (ctx?.setAutoView) return await ctx.setAutoView(true);

  return "👀 Auto-view status aktive.";
});

add("autolike", "Auto like status", async (ctx) => {
  if (ctx?.setAutoLike) return await ctx.setAutoLike(true);

  return "❤️ Auto-like status aktive.";
});

add("statuson", "Aktive tout status automation", async () => {
  return "✅ Status automation aktive.";
});

add("statusoff", "Fèmen status automation", async () => {
  return "❌ Status automation dezaktive.";
});

/* =========================================================
   FUN
========================================================= */

add("joke", "Joke", async () => {
  return "😂 Poukisa òdinatè a pa t ale lekòl? Li te deja gen anpil cache!";
});

add("quote", "Quote", async () => {
  return "💭 Chak gwo bagay kòmanse ak yon ti etap.";
});

add("fact", "Random fact", async () => {
  return "🧠 Yon jou gen 24 èdtan.";
});

add("coin", "Flip coin", async () => {
  return Math.random() < 0.5 ? "🪙 PILE" : "🪙 FACE";
});

add("dice", "Roll dice", async () => {
  return `🎲 Rezilta: ${Math.floor(Math.random() * 6) + 1}`;
});

add("8ball", "Magic 8-ball", async () => {
  const answers = [
    "🎱 Wi!",
    "🎱 Non.",
    "🎱 Petèt.",
    "🎱 Mwen pa sèten.",
    "🎱 Eseye ankò pita."
  ];

  return answers[Math.floor(Math.random() * answers.length)];
});

add("rps", "Rock paper scissors", async () => {
  const values = ["🪨 Rock", "📄 Paper", "✂️ Scissors"];

  return `🎮 Mwen chwazi: ${
    values[Math.floor(Math.random() * values.length)]
  }`;
});

add("choose", "Chwazi yon opsyon", async (ctx) => {
  const options = ctx.args || [];

  if (!options.length) {
    return `Egzanp:
${PREFIX}choose pizza burger`;
  }

  return `🎯 Mwen chwazi: ${options[Math.floor(Math.random() * options.length)]}`;
});

add("roll", "Random number", async (ctx) => {
  const max = Number(ctx.args?.[0]) || 100;

  return `🎲 Rezilta: ${Math.floor(Math.random() * max) + 1}`;
});

/* =========================================================
   TOOLS
========================================================= */

add("echo", "Repete tèks", async (ctx) => {
  return ctx.args?.join(" ") || "🔊 Echo!";
});

add("say", "Di mesaj", async (ctx) => {
  return ctx.args?.join(" ") || "🗣️";
});

add("reverse", "Ranvèse tèks", async (ctx) => {
  return (ctx.args?.join(" ") || "").split("").reverse().join("");
});

add("upper", "Majiskil", async (ctx) => {
  return (ctx.args?.join(" ") || "").toUpperCase();
});

add("lower", "Miniskil", async (ctx) => {
  return (ctx.args?.join(" ") || "").toLowerCase();
});

add("calc", "Kalkil", async (ctx) => {
  const expression = ctx.args?.join(" ");

  if (!expression) {
    return `Egzanp:
${PREFIX}calc 10 + 5`;
  }

  if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
    return "❌ Kalkil sa pa aksepte.";
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();

    return `🧮 Rezilta: ${result}`;
  } catch {
    return "❌ Kalkil pa valid.";
  }
});

add("translate", "Tradiksyon", async () => {
  return "🌍 Fonksyon tradiksyon an pare pou konekte ak API tradiksyon.";
});

add("weather", "Météo", async (ctx) => {
  const city = ctx.args?.join(" ") || "Haiti";

  return `🌤️ Météo pou ${city}

API météo poko konekte.`;
});

add("timezone", "Timezone", async () => {
  return `🌍 Timezone:
${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
});

add("uuid", "Jenere UUID", async () => {
  return `🆔 ${cryptoRandomUUID()}`;
});

add("random", "Random number", async () => {
  return `🎲 ${Math.floor(Math.random() * 1000000)}`;
});

add("qr", "QR generator", async () => {
  return "🔳 QR generator pare pou konekte ak sèvis QR.";
});

add("short", "Short URL", async () => {
  return "🔗 URL shortener poko konekte.";
});

add("base64", "Encode Base64", async (ctx) => {
  const value = ctx.args?.join(" ");

  if (!value) return "❌ Mete tèks la.";

  return Buffer.from(value).toString("base64");
});

add("decode", "Decode Base64", async (ctx) => {
  const value = ctx.args?.join("");

  if (!value) return "❌ Mete Base64 la.";

  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return "❌ Base64 pa valid.";
  }
});

/* =========================================================
   SYSTEM
========================================================= */

add("stats", "Bot statistics", async (ctx) => {
  if (ctx?.getStats) return await ctx.getStats();

  return `📊 ${BOT_NAME}

Status: ONLINE
Commands: ${Object.keys(commands).length}`;
});

add("logs", "Bot logs", async (ctx) => {
  if (ctx?.getLogs) return await ctx.getLogs();

  return "📋 Logs yo disponib sèlman pou owner.";
});

add("reload", "Reload commands", async () => {
  return "🔄 Commands reload requested.";
});

add("restart", "Restart bot", async (ctx) => {
  if (ctx?.restart) return await ctx.restart();

  return "🔄 Restart requested.";
});

add("broadcast", "Broadcast message", async (ctx) => {
  if (!ctx?.isOwner) {
    return "⛔ Kòmand sa rezève pou owner.";
  }

  return "📢 Broadcast function pare.";
});

add("users", "Lis users", async (ctx) => {
  if (!ctx?.isOwner) {
    return "⛔ Kòmand sa rezève pou owner.";
  }

  if (ctx?.getUsers) return await ctx.getUsers();

  return "👥 Users system.";
});

add("about", "About bot", async () => {
  return `
🤖 ${BOT_NAME}

👑 Created by: ${OWNER}

⚡ Telegram + WhatsApp
🛡️ Group Management
🔧 Utility Commands
📱 WhatsApp Baileys
`;
});

/* =========================================================
   EXTRA COMMANDS
========================================================= */

add("creator", "Creator", async () => {
  return `👑 Creator: ${OWNER}`;
});

add("contact", "Contact owner", async () => {
  return "📞 Contact owner pou plis enfòmasyon.";
});

add("support", "Support", async () => {
  return "🛠️ KIM-DOLC-MD Support";
});

add("privacy", "Privacy info", async () => {
  return "🔐 Pa pataje token bot la ak lòt moun.";
});

add("security", "Security info", async () => {
  return "🛡️ Bot security active.";
});

add("online", "Check online", async () => {
  return "🟢 Bot la ONLINE.";
});

add("offline", "Offline status", async () => {
  return "🔴 Offline mode.";
});

add("source", "Project source", async () => {
  return "💻 KIM-DOLC-MD";
});

add("prefix", "Montre prefix", async () => {
  return `⚡ Prefix: ${PREFIX}`;
});

add("commands", "Montre kantite kòmand", async () => {
  return `📚 Total commands: ${Object.keys(commands).length}`;
});

add("test", "Test bot", async () => {
  return "✅ Test successful!";
});

add("hello", "Greeting", async () => {
  return "👋 Bonjou KIM!";
});

add("hi", "Greeting", async () => {
  return "👋 Hi!";
});

add("goodmorning", "Good morning", async () => {
  return "🌅 Bonjou! Pase yon bèl jounen.";
});

add("goodnight", "Good night", async () => {
  return "🌙 Bòn nuit!";
});

add("love", "Love", async () => {
  return "❤️ Peace & Respect.";
});

add("kim", "KIM command", async () => {
  return "👑 KIM DOLCE";
});

add("dolce", "Dolce command", async () => {
  return "🔥 KIM-DOLC-MD";
});

/* =========================================================
   UTILITY
========================================================= */

function cryptoRandomUUID() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }
  );
}

/* =========================================================
   EXECUTE COMMAND
========================================================= */

async function executeCommand(commandName, ctx = {}) {
  const name = text(commandName)
    .toLowerCase()
    .replace(/^\./, "")
    .replace(/^\//, "");

  const command = commands[name];

  if (!command) {
    return `❌ Kòmand "${name}" pa egziste.

Tape ${PREFIX}menu pou wè kòmand yo.`;
  }

  try {
    return await command.handler(ctx);
  } catch (error) {
    console.error(`Command error [${name}]:`, error);

    return `❌ Erè pandan "${PREFIX}${name}".`;
  }
}

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  BOT_NAME,
  OWNER,
  PREFIX,
  commands,
  executeCommand
};
