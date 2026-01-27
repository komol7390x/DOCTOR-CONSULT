import { FastifyRequest, FastifyReply } from "fastify";
import { DoctorService } from "./doctor.service";
import { ERROR_MESSAGES } from "../../core/constants/error-messages";

const doctorService = new DoctorService();

export class DoctorController {
  
  async getDoctors(request: FastifyRequest, reply: FastifyReply) {
    const result = await doctorService.getDoctors(request.query);
    return reply.status(200).send(result);
  }

  async getPatients(request: FastifyRequest, reply: FastifyReply) {
    const result = await doctorService.getPatients(request.query);
    return reply.status(200).send(result);
  }

  async getDoctorById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number | string };
    const doctorId = Number(id);

    if (Number.isNaN(doctorId)) {
      return reply.status(400).send({
        error: "Validation Error",
        message: ERROR_MESSAGES.INVALID_DOCTOR_ID,
      });
    }

    const doctor = await doctorService.getDoctorById(doctorId);

    if (!doctor) {
      return reply.status(404).send({
        error: "Not Found",
        message: ERROR_MESSAGES.DOCTOR_NOT_FOUND,
      });
    }

    return reply.status(200).send({ doctor });
  }

  async getDoctorAppointments(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number | string };
    const doctorId = Number(id);

    if (Number.isNaN(doctorId)) {
      return reply.status(400).send({
        error: "Validation Error",
        message: ERROR_MESSAGES.INVALID_DOCTOR_ID,
      });
    }

    const appointments = await doctorService.getDoctorAppointments(doctorId);
    return reply.status(200).send({ appointments });
  }
}
