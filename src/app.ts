import Fastify, { FastifyInstance } from 'fastify';
import mainPlugin from './plugin/index.js';
import { logger } from 'common/ui-logger/logs-ui.js';
import { router } from 'modules/index.js';
import { config } from 'config/config.js';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

class App {
  public fastify: FastifyInstance;
  logger = logger();

  constructor() {
    this.fastify = Fastify({
      logger: true,
      trustProxy: true
    });
  }

  private async setup() {
    this.fastify.setValidatorCompiler(validatorCompiler);
    this.fastify.setSerializerCompiler(serializerCompiler);

    await this.fastify.register(mainPlugin);
    await this.fastify.register(router, { prefix: '/api/v1' });
  }

  public async start() {
    try {
      await this.setup();

      const address = await this.fastify.listen({
        port: config.PORT,
        host: config.HOST
      });

      console.log('\x1b[36m%s\x1b[0m', `🚀 Fastify server is flying on ${address}/api/v1`);
      console.log('\x1b[36m%s\x1b[0m', `🚀 Swagger is running ${address}/api/v1/docs`);
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}

export default new App();
