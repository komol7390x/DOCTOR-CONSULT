import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import basicAuth from '@fastify/basic-auth';

export default fp(async (fastify) => {
  fastify.register(basicAuth, {
    validate: async (username, password) => {
      if (username !== 'admin' || password !== 'maxfiy_parol_123') {
        return new Error("Login yoki parol noto'g'ri!");
      }
    },
    authenticate: { realm: 'Docs' }
  });

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Doctor Consult API',
        description: 'Prisma va Fastify asosidagi API hujjatlari',
        version: '1.0.0'
      },
      servers: [{ url: 'http://localhost:3030' }]
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/api/v1/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

  fastify.addHook('onRoute', (routeOptions) => {
    if (routeOptions.url.startsWith('api/v1/docs')) {
      routeOptions.onRequest = fastify.basicAuth;
    }
  });
});
