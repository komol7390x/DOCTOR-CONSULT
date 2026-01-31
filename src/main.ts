import Fastify from "fastify";
import routes from "./our.js";
const fastify = Fastify({
  logger: true,
});

fastify.get("/", async () => {
  return { message: "Doctor Consult API is running!" };
});
// fastify.register(routes, { prefix: "/v1" });
const start = async () => {
  try {
    await fastify.listen({ port: 3030, host: "0.0.0.0" });
    console.log("🚀 Server running at http://localhost:3030");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
