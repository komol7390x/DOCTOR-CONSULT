import { FastifyPluginAsync } from 'fastify';
import { AppointmentController } from '../controllers/appointment.controller';

const appointmentController = new AppointmentController();

const appointmentsRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/appointments - Create new appointment
  fastify.post(
    '/appointments',
    {
      schema: {
        description: 'Create a new appointment',
        tags: ['appointments'],
        body: {
          type: 'object',
          required: ['patientId', 'doctorId', 'startTime', 'endTime'],
          properties: {
            patientId: { type: 'string', description: 'Patient user ID' },
            doctorId: { type: 'string', description: 'Doctor user ID' },
            startTime: { type: 'string', format: 'date-time', description: 'Appointment start time' },
            endTime: { type: 'string', format: 'date-time', description: 'Appointment end time' },
            notes: { type: 'string', description: 'Additional notes' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              appointment: {
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
                    },
                  },
                  doctor: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' },
                      email: { type: 'string' },
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
    },
    appointmentController.createAppointment
  );

  // PUT /api/appointments/:id/complete - Complete an appointment
  fastify.put(
    '/appointments/:id/complete',
    {
      schema: {
        description: 'Complete an appointment',
        tags: ['appointments'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'Appointment ID' },
          },
        },
        body: {
          type: 'object',
          properties: {
            notes: { type: 'string', description: 'Completion notes' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              appointment: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  status: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    appointmentController.completeAppointment
  );

  // POST /api/appointments/:id/prescription - Create prescription for completed appointment
  fastify.post(
    '/appointments/:id/prescription',
    {
      schema: {
        description: 'Create prescription for a completed appointment',
        tags: ['appointments'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'Appointment ID' },
          },
        },
        body: {
          type: 'object',
          required: ['diagnosis', 'instructions', 'medications'],
          properties: {
            diagnosis: { type: 'string', description: 'Diagnosis' },
            instructions: { type: 'string', description: 'Instructions for patient' },
            medications: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'dosage', 'frequency', 'duration'],
                properties: {
                  name: { type: 'string', description: 'Medication name' },
                  dosage: { type: 'string', description: 'Dosage' },
                  frequency: { type: 'string', description: 'Frequency' },
                  duration: { type: 'string', description: 'Duration' },
                  notes: { type: 'string', description: 'Additional notes' },
                },
              },
            },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              prescription: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  appointmentId: { type: 'string' },
                  patientId: { type: 'string' },
                  doctorId: { type: 'string' },
                  diagnosis: { type: 'string' },
                  instructions: { type: 'string' },
                  createdAt: { type: 'string' },
                  medications: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        dosage: { type: 'string' },
                        frequency: { type: 'string' },
                        duration: { type: 'string' },
                        notes: { type: 'string' },
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
    appointmentController.createPrescription
  );

  // GET /api/appointments/:id - Get appointment by ID
  fastify.get(
    '/appointments/:id',
    {
      schema: {
        description: 'Get appointment by ID',
        tags: ['appointments'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'Appointment ID' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              appointment: {
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
                  doctor: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' },
                      email: { type: 'string' },
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
                  prescriptions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        diagnosis: { type: 'string' },
                        instructions: { type: 'string' },
                        medications: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              dosage: { type: 'string' },
                              frequency: { type: 'string' },
                              duration: { type: 'string' },
                              notes: { type: 'string' },
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
        },
      },
    },
    appointmentController.getAppointmentById
  );

  // GET /api/patients/:patientId/appointments - Get patient's appointments
  fastify.get(
    '/patients/:patientId/appointments',
    {
      schema: {
        description: 'Get all appointments for a specific patient',
        tags: ['appointments'],
        params: {
          type: 'object',
          required: ['patientId'],
          properties: {
            patientId: { type: 'string', description: 'Patient ID' },
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
                    doctor: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
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
                    prescriptions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          diagnosis: { type: 'string' },
                          instructions: { type: 'string' },
                          medications: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                dosage: { type: 'string' },
                                frequency: { type: 'string' },
                                duration: { type: 'string' },
                                notes: { type: 'string' },
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
          },
        },
      },
    },
    appointmentController.getAppointmentsByPatient
  );
};

export default appointmentsRoutes;
