import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenName } from '../../config/token-name';
import Error from 'http-errors';
import prisma from '../../database/prisma';
import { config } from 'config/config';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    authGuardPlugin: (request: FastifyRequest, replay: FastifyReply) => Promise<void>;
  }
  interface FastifyContextConfig {
    roles?: string[];
  }
}
export default fp(async (fastify) => {
  const handleRefresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies[TokenName.REFRESH];
    if (!refreshToken) {
      throw new Error.Unauthorized('Session expired, please login again');
    }

    try {
      const payload = await fastify.tokenPlugin.verifyToken(refreshToken);
      const admin = await fastify.prisma.admin.findUnique({ where: { id: payload.id } });

      if (!admin) throw Error.NotFound('Unauthorized: Admin not found');
      if (!admin.isActive) throw Error.Forbidden('Forbidden: Account is deactivated');

      const newPayload = {
        id: admin.id,
        role: admin.role,
        isActive: true
      };

      const newAccessToken = await fastify.tokenPlugin.accessToken(newPayload);
      fastify.tokenPlugin.writeCookie(reply, config.TOKEN.ACCESS_TOKEN_KEY, newAccessToken);

      request.user = newPayload;
    } catch (err) {
      throw Error(401, 'Invalid refresh token');
    }
  };

  const authGuardPlugin = async (request: FastifyRequest, reply: FastifyReply) => {
    const roles = request.routeOptions.config.roles as string[];

    if (roles?.includes('public')) {
      return;
    }

    const tokenName = TokenName.ACCESS;
    let accessToken: string | null = request?.cookies[tokenName] ?? null;

    if (!accessToken) {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      accessToken = type === 'Bearer' ? token : null;
    }
    if (!accessToken) {
      return await handleRefresh(request, reply);
    }

    try {
      const user = await fastify.tokenPlugin.verifyToken(accessToken);
      if (!user.isActive) {
        throw Error.Forbidden('Forbidden: Account is deactivated');
      }
      request.user = user;
    } catch (error) {
      return await handleRefresh(request, reply);
    }
  };

  fastify.decorate('authGuardPlugin', authGuardPlugin);
});
