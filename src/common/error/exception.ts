import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as geoip from 'geoip-lite';

export default fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(async (error: any, request: FastifyRequest, reply: FastifyReply) => {
    // 1. DEFAULT QIYMATLAR
    let statusCode = error.statusCode || error.status || 500;
    let finalMessage = error.message || 'Internal server error';
      let errorType = error.name || 'InternalServerError';
      
    if (error.code?.startsWith('P')) {
      errorType = 'DatabaseError';
      if (error.code === 'P2002') {
        statusCode = 409;
        finalMessage = `Duplicate field value: ${error.meta?.target}`;
      } else if (error.code === 'P2025') {
        statusCode = 404;
        finalMessage = 'Record not found';
      } else {
        statusCode = 400;
      }
    }

    if (error.validation) {
      statusCode = 400;
      errorType = 'ValidationError';
      finalMessage = error.validation.map((err: any) => `${err.instancePath} ${err.message}`).join(', ');
    }

    const clientIp = (request.headers['x-forwarded-for'] as string)?.split(',')[0] || request.ip || '127.0.0.1';
    const geo = geoip.lookup(clientIp);
    const country = geo ? geo.country : 'Local';

    const logPayload = {
      path: request.url,
      method: request.method,
      status: statusCode,
      country,
      ip: clientIp,
      message: finalMessage,
      stack: statusCode >= 500 ? error.stack : undefined
    };

    if (statusCode >= 500) {
      request.log.error(logPayload, `🔥 CRITICAL ERROR`);
    } else {
      request.log.warn(logPayload, `⚠️ CLIENT ERROR`);
    }

    const responseBody = {
      success: false,
      statusCode,
      error: errorType,
      message: finalMessage,
      timestamp: new Date().toISOString(),
      path: request.url
    };

    return reply.status(statusCode).send(responseBody);
  });
});
