import Fastify, { FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import prismaPlugin from './database/prisma';
import authGuardPlugin from 'plugin/guard/auth.guard';
import rolesGuardPlugin from 'plugin/guard/role.guard';
import tokenPlugin from './plugin/token/token';
import jwt from '@fastify/jwt';
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
      await this.fastify.register(fastifyCookie, {
        secret: 'Prisma-fastify',
        parseOptions: {}
      });

      await this.fastify.register(prismaPlugin);
      await this.fastify.register(jwt, { secret: 'Prisma-fastify' });
      await this.fastify.register(tokenPlugin);
      await this.fastify.register(authGuardPlugin);
      await this.fastify.register(rolesGuardPlugin);
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
