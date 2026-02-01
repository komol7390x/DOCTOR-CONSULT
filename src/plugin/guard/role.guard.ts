import { IToken } from 'common/type/IToken';
import { FastifyRequest } from 'fastify';
import createError from 'http-errors';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    RolesGuardPlugin: (request: FastifyRequest, replay: FastifyReply) => Promise<void>;
  }
  interface FastifyContextConfig {
    roles?: string[];
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: IToken;
    user: IToken;
  }
}

export default fp(async (fastify) => {
  const RolesGuardPlugin = async (request: FastifyRequest) => {
    const roles = request.routeOptions.config.roles;
    if (!roles || roles.length == 0) {
      throw createError(403, 'Access Denied: No roles defined for this route');
    }
    if (roles.includes('public')) {
      return;
    }

    const user = request.user;
    if (!user) {
      throw createError(401, 'Unauthorized: User not found');
    }

    const hasRole = user.role && roles.includes(user.role);
    const isOwner = roles.includes('ID') && user.id === Number((request.params as any).id);

    if (hasRole || isOwner) {
      return;
    }
    throw createError(403, `Forbidden: Required roles [${roles.join(', ')}]`);
  };

  fastify.decorate('RolesGuardPlugin', RolesGuardPlugin);
});
