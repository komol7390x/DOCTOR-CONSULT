import { FastifyRequest, FastifyReply } from 'fastify';
import { DoctorService } from '../services/doctor.service';
import { z } from 'zod';

const doctorService = new DoctorService();

export class DoctorController {
  async getDoctors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await doctorService.getDoctors(request.query);
      return reply.status(200).send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Invalid query parameters',
          details: error.errors,
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch doctors',
      });
    }
  }

  async getDoctorById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const doctor = await doctorService.getDoctorById(id);

      if (!doctor) {
        return reply.status(404).send({
          error: 'Doctor Not Found',
          message: 'The specified doctor does not exist',
        });
      }

      return reply.status(200).send({ doctor });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch doctor',
      });
    }
  }

  async getDoctorAppointments(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const appointments = await doctorService.getDoctorAppointments(id);
      return reply.status(200).send({ appointments });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch doctor appointments',
      });
    }
  }
}
