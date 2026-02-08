import { Telegraf } from "telegraf";
import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const TARGET_CHAT_ID = process.env.TARGET_CHAT_ID;
const TOPIC_ID = process.env.TOPIC_ID ? Number(process.env.TOPIC_ID) : null;
const ADMIN_ID = process.env.ADMIN_ID;

const fastify = Fastify({ logger: false });
const bot = new Telegraf(BOT_TOKEN);

bot.on("message", async (ctx) => {
  if (ctx.from.id === ctx.botInfo.id) return;

  if (!TARGET_CHAT_ID) {
    console.error("XATO: TARGET_CHAT_ID topilmadi (.env faylni tekshiring)");
    return;
  }

  try {
    await ctx.copyMessage(TARGET_CHAT_ID, {
      message_thread_id: TOPIC_ID,
    });
    console.log(`Xabar ${TOPIC_ID}-mavzuga yuborildi`);
  } catch (err) {
    const errorMessage = `❌ Xatolik yuz berdi: ${err.message}`;
    console.error(errorMessage);

    if (ADMIN_ID) {
      await ctx.telegram.sendMessage(ADMIN_ID, errorMessage).catch(() => {
        console.error("Admin ID ga xabar yuborib bo'lmadi.");
      });
    }
  }
});

const start = async () => {
  try {
    await bot.launch();
    console.log(`🚀 Bot ishga tushdi`);
    console.log(`Target Chat: ${TARGET_CHAT_ID}, Topic ID: ${TOPIC_ID}`);

    const port = process.env.PORT || 3000;
    await fastify.listen({ port: Number(port), host: "0.0.0.0" });
  } catch (err) {
    console.error("Start xatosi:", err);
    process.exit(1);
  }
};

start();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
