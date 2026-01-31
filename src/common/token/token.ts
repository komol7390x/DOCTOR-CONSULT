import { FastifyInstance, FastifyReply } from 'fastify';
import { IToken } from '../type/IToken.js';
import { config } from '../../config/config.js';
import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').JWT;
  }
}
export class TokenService {
  private static fastify: FastifyInstance;

  // 1. Server yonganda bir marta chaqiriladi
  static init(instance: FastifyInstance) {
    this.fastify = instance;
  }

  // 2. Access Token
  static async accessToken(payload: IToken): Promise<string> {
    return this.fastify.jwt.sign(payload, {
      expiresIn: config.TOKEN.ACCESS_TOKEN_TIME
    });
  }

  // 3. Refresh Token
  static async refreshToken(payload: IToken): Promise<string> {
    return this.fastify.jwt.sign(payload, {
      expiresIn: config.TOKEN.REFRESH_TOKEN_TIME
    });
  }

  static writeCookie(reply: FastifyReply, key: string, value: string, timeInSeconds: number = config.TOKEN.ACCESS_TOKEN_TIME) {
    reply.setCookie(key, value, {
      path: '/',
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: timeInSeconds
    });
  }

  // 5. Verify
  static async verifyToken(token: string): Promise<IToken> {
    return this.fastify.jwt.verify<IToken>(token);
  }
}
