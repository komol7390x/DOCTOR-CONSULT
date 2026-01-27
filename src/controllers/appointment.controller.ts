import { FastifyRequest, FastifyReply } from 'fastify';
import { AppointmentService } from '../services/appointment.service';
import { z } from 'zod';

const appointmentService = new AppointmentService();

export class AppointmentController {
  async createAppointment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const appointment = await appointmentService.createAppointment(request.body);
      return reply.status(201).send({ appointment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Invalid request data',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('in the past')) {
          return reply.status(400).send({
            error: 'Invalid Time',
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes('End time must be after start time')) {
          return reply.status(400).send({
            error: 'Invalid Time Range',
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes('doctor does not exist')) {
          return reply.status(404).send({
            error: 'Doctor Not Found',
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes('patient does not exist')) {
          return reply.status(404).send({
            error: 'Patient Not Found',
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes('already booked')) {
          return reply.status(409).send({
            error: 'Time Conflict',
            message: errorMessage,
          });
        }
      }

      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to create appointment',
      });
    }
  }

  async completeAppointment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const appointment = await appointmentService.completeAppointment(id, request.body);
      return reply.status(200).send({ appointment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Invalid request data',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('appointment does not exist')) {
          return reply.status(404).send({
            error: 'Appointment Not Found',
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes('Only scheduled appointments')) {
          return reply.status(400).send({
            error: 'Invalid Status',
            message: errorMessage,
          });
        }
      }

      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to complete appointment',
      });
    }
  }

  async createPrescription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const prescription = await appointmentService.createPrescription(id, request.body);
      return reply.status(201).send({ prescription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Invalid request data',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('appointment does not exist')) {
          return reply.status(404).send({
            error: 'Appointment Not Found',
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes('completed appointments')) {
          return reply.status(400).send({
            error: 'Invalid Status',
            message: errorMessage,
          });
        }
        
        if (errorMessage.includes('prescription already exists')) {
          return reply.status(409).send({
            error: 'Prescription Exists',
            message: errorMessage,
          });
        }
      }

      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to create prescription',
      });
    }
  }

  async getAppointmentById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const appointment = await appointmentService.getAppointmentById(id);

      if (!appointment) {
        return reply.status(404).send({
          error: 'Appointment Not Found',
          message: 'The specified appointment does not exist',
        });
      }

      return reply.status(200).send({ appointment });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch appointment',
      });
    }
  }

  async getAppointmentsByPatient(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { patientId } = request.params as { patientId: string };
      const appointments = await appointmentService.getAppointmentsByPatient(patientId);
      return reply.status(200).send({ appointments });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch patient appointments',
      });
    }
  }
}
