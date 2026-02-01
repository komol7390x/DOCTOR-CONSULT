import fp from 'fastify-plugin';
import { hash, compare } from 'bcrypt';

declare module 'fastify' {
  interface FastifyInstance {
    crypto: {
      encrypt(password: string): Promise<string>;
      compare(password: string, hash: string): Promise<boolean>;
    };
  }
}

export default fp(async (fastify) => {
  const cryptoService = {
    async encrypt(password: string): Promise<string> {
      return hash(password, 7);
    },

    async compare(password: string, hashedPassword: string): Promise<boolean> {
      return compare(password, hashedPassword);
    }
  };

  fastify.decorate('crypto', cryptoService);
});
