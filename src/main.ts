import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { prisma } from './database/prisma';
import { TokenService } from 'common/token/token';

const fastify = Fastify({
  logger: true
});

fastify.register(fastifyCookie, {
  secret: 'Prisma-fastify',
  parseOptions: {}
});

TokenService.init(fastify);

fastify.decorate('prisma', prisma);
const start = async () => {
  try {
    await fastify.listen({ port: 3030, host: '0.0.0.0' });
    console.log('\x1b[36m%s\x1b[0m', '🚀 Fastify server is flying on http://localhost:3030');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
