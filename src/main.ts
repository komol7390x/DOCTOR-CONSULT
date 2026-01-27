import "dotenv/config";
import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import swaggerPlugin from "./plugins/swagger";
import { allExceptionFilter } from "./core/error-handle/all-exception.filter";
import doctorRoutes from "./modules/doctor/doctor.routes";
import appointmentRoutes from "./modules/appointments/appointment.routes";

const fastify = Fastify({
  logger: true,
});

export const prisma = new PrismaClient();

fastify.register(swaggerPlugin);

fastify.register(doctorRoutes, { prefix: "/api/doctors" });
fastify.register(appointmentRoutes, { prefix: "/api/appointments" });

fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

fastify.setErrorHandler(allExceptionFilter);

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "3000");
    const host = process.env.HOST || "localhost";

    await fastify.listen({ port, host });

    console.log("\n" + "=".repeat(60));
    console.log("🚀  SERVER STARTED SUCCESSFULLY");
    console.log("=".repeat(60));
    console.log(`📍  API Server    : http://${host}:${port}`);
    console.log(`📚  Documentation : http://${host}:${port}/docs`);
    console.log(`❤️   Health Check : http://${host}:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("\n" + "=".repeat(60));
  console.log("👋  Shutting down gracefully...");
  console.log("=".repeat(60) + "\n");
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n" + "=".repeat(60));
  console.log("👋  Shutting down gracefully...");
  console.log("=".repeat(60) + "\n");
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

start();
