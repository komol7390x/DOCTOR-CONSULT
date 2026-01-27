import { FastifyPluginAsync } from 'fastify';
import { DoctorController } from '../controllers/doctor.controller';

const doctorController = new DoctorController();

const doctorsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/doctors - Get all doctors with optional specialty filter
  fastify.get(
    '/doctors',
    {
      schema: {
        description: 'Get all doctors with optional specialty filter',
        tags: ['doctors'],
        querystring: {
          type: 'object',
          properties: {
            specialty: {
              type: 'string',
              description: 'Filter doctors by specialty',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              doctors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    phone: { type: 'string' },
                    role: { type: 'string' },
                    doctorProfile: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        specialty: { type: 'string' },
                        experience: { type: 'number' },
                        consultationPrice: { type: 'number' },
                        description: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    doctorController.getDoctors
  );

  // GET /api/doctors/:id - Get doctor by ID
  fastify.get(
    '/doctors/:id',
    {
      schema: {
        description: 'Get doctor by ID',
        tags: ['doctors'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'Doctor ID' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              doctor: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  phone: { type: 'string' },
                  role: { type: 'string' },
                  doctorProfile: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      specialty: { type: 'string' },
                      experience: { type: 'number' },
                      consultationPrice: { type: 'number' },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    doctorController.getDoctorById
  );

  // GET /api/doctors/:id/appointments - Get doctor's appointments
  fastify.get(
    '/doctors/:id/appointments',
    {
      schema: {
        description: 'Get all appointments for a specific doctor',
        tags: ['doctors'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'Doctor ID' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              appointments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    patientId: { type: 'string' },
                    doctorId: { type: 'string' },
                    startTime: { type: 'string' },
                    endTime: { type: 'string' },
                    status: { type: 'string' },
                    notes: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    patient: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    doctorController.getDoctorAppointments
  );
};

export default doctorsRoutes;
