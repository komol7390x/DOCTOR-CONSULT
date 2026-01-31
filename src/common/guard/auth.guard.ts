import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenName } from '../../config/token-name';
import Error from 'http-errors';
import { prisma } from '../../database/prisma';
import { TokenService } from 'common/token/token';
import { config } from 'config/config';

declare module 'fastify' {
  interface FastifyContextConfig {
    roles?: string[];
  }
}

export const AuthGuard = async (request: FastifyRequest, replay: FastifyReply) => {
  const roles = request.routeOptions.config.roles as string[];
  if (roles?.includes('public')) {
    return;
  }
  const token = TokenName.ACCESS;
  let accessToken: string | null = request?.cookies[token] ?? null;
  if (!accessToken) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    accessToken = type === 'Bearer' ? token : null;
  }
  if (!accessToken) {
    return await handleRefresh(request, replay);
  }
  try {
    const user = await TokenService.verifyToken(accessToken);
    if (!user.isActive) {
      throw Error(403, 'Forbidden: Account is deactivated');
    }
    return (request.user = user);
  } catch (error) {}
};

const handleRefresh = async (request: FastifyRequest, replay: FastifyReply) => {
  const refreshToken = request.cookies[TokenName.REFRESH];
  if (!refreshToken) {
    throw new Error.Unauthorized('Session expired, please login again');
  }
  try {
    const payload = TokenService.verifyToken(refreshToken);
    const admin = await prisma.admin.findUnique({ where: { id: (await payload).id } });

    if (!admin) {
      throw Error(401, 'Unauthorized: Admin not found');
    }

    if (!admin.isActive) {
      throw Error(403, 'Forbidden: Account is deactivated');
    }

    const newPayload = {
      id: admin.id,
      role: admin.role,
      isActive: true
    };

    const newAccessToken = await TokenService.accessToken(newPayload);
    TokenService.writeCookie(replay, config.TOKEN.REFRESH_TOKEN_KEY, newAccessToken);
    return (request.user = newPayload);
  } catch (err) {
    throw Error(401, 'Invalid refresh token');
  }
};
