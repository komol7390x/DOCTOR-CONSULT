import { Telegraf } from "telegraf";

const BOT_TOKEN = "8576420482:AAFMlta6i3ssJmWiVFEO3Ys47NUFi-Le5ck";
const bot = new Telegraf(BOT_TOKEN);

bot.on("message", async (ctx) => {
  console.log("--- XABAR KELDI ---");

  if (ctx.message.forward_from_chat) {
    const channelId = ctx.message.forward_from_chat.id;
    const channelTitle = ctx.message.forward_from_chat.title;

    console.log("Kanal nomi:", channelTitle);
    console.log("KANAL ID-SI:", channelId); 
    return ctx.reply(
      `Kanal ID-si topildi!\nNomi: ${channelTitle}\nID: ${channelId}`,
    );
  }

  // Oddiy xabar bo'lsa
  console.log("Sizning ID-ingiz:", ctx.from.id);
  console.log("Chat ID (shaxsiy):", ctx.chat.id);

  await ctx.reply(
    `Bu shaxsiy xabar.\nSizning ID: ${ctx.from.id}\n\nKanal ID-sini bilish uchun kanaldagi birorta postni menga FORWARD qiling.`,
  );
});

bot.launch();
console.log("Bot ishga tushdi...");
