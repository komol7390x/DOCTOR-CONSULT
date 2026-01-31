import fastify from "fastify";

const app = fastify({
//   logger: true,
});

app.get("/", async () => {
  return { message: "Doctor Consult API is running!" };
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Server running at http://localhost:3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
