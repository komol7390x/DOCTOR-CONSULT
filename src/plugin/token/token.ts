import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply } from 'fastify';
import { IToken } from 'common/type/IToken.type';
import { config } from 'config/config';
import jwt from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    tokenPlugin: {
      accessToken(payload: IToken): Promise<string>;
      refreshToken(payload: IToken): Promise<string>;
      verifyToken(token: string): Promise<IToken>;
      writeCookie(reply: FastifyReply, key: string, value: string, time?: number): void;
    };
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const tokenPlugin = {
    async accessToken(payload: IToken): Promise<string> {
      return fastify.jwt.sign(payload, {
        expiresIn: config.TOKEN.ACCESS_TOKEN_TIME
      });
    },

    async refreshToken(payload: IToken): Promise<string> {
      return fastify.jwt.sign(payload, {
        expiresIn: config.TOKEN.REFRESH_TOKEN_TIME
      });
    },

    async verifyToken(token: string): Promise<IToken> {
      return fastify.jwt.verify<IToken>(token);
    },

    writeCookie(reply: FastifyReply, key: string, value: string, timeInSeconds: number = config.TOKEN.ACCESS_TOKEN_TIME) {
      reply.setCookie(key, value, {
        path: '/',
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: timeInSeconds
      });
    }
  };
  fastify.decorate('tokenPlugin', tokenPlugin);
});
