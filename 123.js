import { Telegraf } from "telegraf";

const BOT_TOKEN = "8519480277:AAFpudhBHsP12CgMCbxkJ_IgKrB98ptuIWg";
const bot = new Telegraf(BOT_TOKEN);

bot.on("message", (ctx) => {
  const topicId = ctx.message.message_thread_id;
  console.log("Topic ID:", topicId);
  console.log("Chat ID:", ctx.chat.id);
});

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
