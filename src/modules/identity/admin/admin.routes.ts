import { FastifyInstance } from 'fastify';
import { AdminController } from './admin.controller';
import { loginSchema } from './admin.schema';

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.post('/login', { schema: loginSchema }, AdminController.login);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', fastify.authGuardPlugin);

    protectedRoutes.get('/', { config: { roles: ['public'] } }, AdminController.getAll);
    protectedRoutes.post('/logout', AdminController.logout);

    protectedRoutes.delete('/:id', { config: { roles: ['SuperAdmin'] } }, async (req) => {
      // O'chirish logikasi...
    });
  });
}
