import { FastifyInstance } from 'fastify';
import { AdminController } from './admin.controller';
import { loginSchema } from './admin.schema';
import { Roles } from 'config/Roles';

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.post('/login', { schema: loginSchema }, AdminController.login);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.get('/', { config: { roles: [Roles.PUBLIC] } }, AdminController.getAll);

    protectedRoutes.post('/logout', AdminController.logout);

    protectedRoutes.delete('/:id', { config: { roles: ['SuperAdmin'] } }, async (req) => {});
  });
}
