import { Telegraf } from "telegraf";
import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const ADMIN_ID = process.env.ADMIN_ID;

const fastify = Fastify({ logger: false });
const bot = new Telegraf(BOT_TOKEN);

bot.on("message", (ctx) => {
  console.log("Chat ID:", ctx.chat.id);
});

bot.on("text", async (ctx) => {
  const originalText = ctx.message.text;

  try {
    await ctx.telegram.sendMessage(CHANNEL_ID, originalText);
  } catch (err) {
    const errorMessage = `❌ Xatolik yuz berdi:\nSorov: ${originalText}\nError: ${err.message}`;
    await ctx.telegram.sendMessage(ADMIN_ID, errorMessage).catch(() => {
      console.error("Admin ID ga xabar yuborib bo'lmadi:", err.message);
    });
  }
});
fastify.get("/", async (request, reply) => {
  return { status: "Bot va Server faol", timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    bot.launch();
    console.log("🚀 Telegram Bot Polling rejimida ishga tushdi");

    const port = process.env.PORT || 3000;
    await fastify.listen({ port: Number(port), host: "0.0.0.0" });
    console.log(`🌐 Server ${port}-portda tayyor`);
  } catch (err) {
    console.error("Start xatosi:", err);
    process.exit(1);
  }
};

start();

// Jarayonni xavfsiz to'xtatish
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
