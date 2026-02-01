import fp from 'fastify-plugin';
import pg from 'pg';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../config/config';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify) => {
  const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  const prismaInstance = new PrismaClient({ adapter });

  try {
    await prismaInstance.$connect();
    fastify.decorate('prisma', prismaInstance);
    fastify.addHook('onClose', async (instance) => {
      await instance.prisma.$disconnect();
      await pool.end();
    });
  } catch (error) {
    fastify.log.error({ err: error }, 'Prisma connection failed');
    process.exit(1);
  }
});
