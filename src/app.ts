import Fastify, { FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import adminRoutes from 'modules/identity/admin/admin.routes';
import mainPlugin from './plugin/index.js';
class App {
  public fastify: FastifyInstance;

  constructor() {
    this.fastify = Fastify({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true }
        }
      }
    });

    this.setup();
  }

  private async setup() {
    try {
      await this.fastify.register(mainPlugin);
      await this.fastify.register(adminRoutes, { prefix: '/api/v1/admin' });
    } catch (error) {
      this.fastify.log.error({ err: error }, 'Setup error occurred');
    }
  }

  public async start(port: number = 3030) {
    try {
      const address = await this.fastify.listen({
        port,
        host: '0.0.0.0'
      });
      console.log('\x1b[36m%s\x1b[0m', `🚀 Fastify server is flying on ${address}`);
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}

export default new App();