import { FastifyInstance } from 'fastify';
import { AdminController } from './admin.controller';
import { createSchema, loginSchema } from './admin.schema';
import { Roles } from 'config/Roles';

export default async function adminRoutes(fastify: FastifyInstance) {
  // ------------------------- CREATE -------------------------

  fastify.post('/create', { config: { roles: [Roles.SUPER_ADMIN, Roles.ADMIN] }, schema: createSchema }, AdminController.create);

  // ------------------------- SIGN IN -------------------------

  fastify.post('/sigin', { config: { roles: [Roles.PUBLIC] }, schema: loginSchema }, AdminController.signIn);

  // ------------------------- SIGN OUT -------------------------

  fastify.post('/logout', { config: { roles: [Roles.ADMIN, Roles.SUPER_ADMIN, 'ID'] } }, AdminController.logOut);

  // ------------------------- GET ALL -------------------------

  fastify.get('/', { config: { roles: [Roles.SUPER_ADMIN] } }, AdminController.getAll);

  // ------------------------- GET ONE -------------------------

  fastify.get('/:id', { config: { roles: [Roles.SUPER_ADMIN] } }, AdminController.getOne);

  // ------------------------- DETAILS ME -------------------------

  fastify.get('/details', { config: { roles: [Roles.ADMIN, Roles.SUPER_ADMIN, 'ID'] } }, AdminController.getOne);

  // ------------------------- UPDATE -------------------------

  fastify.patch('/is-active/:id', { config: { roles: [Roles.SUPER_ADMIN] } }, AdminController.isActive);

  // ------------------------- UPDATE -------------------------

  fastify.patch('/:id', { config: { roles: [Roles.ADMIN, Roles.SUPER_ADMIN] } }, AdminController.update);

  // ------------------------- HARD DELETE -------------------------

  fastify.delete('/delete/:id', { config: { roles: [Roles.SUPER_ADMIN] } }, AdminController.hardDelete);

  // ------------------------- SOFT DELETE -------------------------

  fastify.delete('/soft-delete/:id', { config: { roles: [Roles.SUPER_ADMIN] } }, AdminController.softDelete);
}
