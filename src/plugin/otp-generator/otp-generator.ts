import fp from 'fastify-plugin';
import otp from 'otp-generator';

declare module 'fastify' {
  interface FastifyInstance {
    otp: {
      generate: (length?: number) => string;
    };
  }
}

export default fp(async (fastify) => {
  const generate = (length = 6): string => {
    return otp.generate(length, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true 
    });
  };

  fastify.decorate('otp', { generate });
});
