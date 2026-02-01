import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import { config } from '../config/config';

import cryptoPlugin from './crypto/crypto';
import tokenPlugin from './token/token';
import authGuardPlugin from './guard/auth.guard';
import rolesGuardPlugin from './guard/role.guard';
import prismaPlugin from '../database/prisma';

export default fp(async (fastify) => {
  await fastify.register(prismaPlugin);
  await fastify.register(fastifyCookie, {
    secret: 'super-secret'
  });

  await fastify.register(import('@fastify/jwt'), {
    secret: 'super-secret'
  });
  await fastify.register(cryptoPlugin);

  await fastify.register(tokenPlugin);

  await fastify.register(authGuardPlugin);
  await fastify.register(rolesGuardPlugin);

  fastify.log.info('🚀 All core plugins registered successfully');
});
