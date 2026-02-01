import { FastifyInstance } from 'fastify';
import adminRoutes from './identity/admin/admin.routes';

export async function router(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authGuardPlugin);
  await fastify.register(adminRoutes, { prefix: '/admin' });
  //   await fastify.register(userRoutes, { prefix: '/users' });
}
