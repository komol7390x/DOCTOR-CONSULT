import { FastifyInstance, FastifyPluginOptions } from "fastify";

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async (request, reply) => {
    console.log(111, request);
  });
}
export default routes;
