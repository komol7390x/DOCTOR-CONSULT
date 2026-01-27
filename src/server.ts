import 'dotenv/config';
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { PrismaClient } from '@prisma/client';

// Import routes
import doctorsRoutes from './routes/doctors';
import appointmentsRoutes from './routes/appointments';

const fastify = Fastify({
  logger: true,
});

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Register Swagger
fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Doctor Consult API',
      description: 'Telemedicine platform API for booking consultations and prescriptions',
      version: '1.0.0',
    },
    host: 'localhost',
    port: parseInt(process.env.PORT || '3000'),
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'doctors', description: 'Doctor related endpoints' },
      { name: 'appointments', description: 'Appointment related endpoints' },
    ],
  },
});

fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

// Register routes
fastify.register(doctorsRoutes, { prefix: '/api' });
fastify.register(appointmentsRoutes, { prefix: '/api' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.validation,
    });
    return;
  }

  if (error.statusCode) {
    reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
    });
    return;
  }

  reply.status(500).send({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || 'localhost';

    await fastify.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
    console.log(`📚 Swagger docs available at http://${host}:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

start();
