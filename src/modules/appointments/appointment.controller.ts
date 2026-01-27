import { FastifyRequest, FastifyReply } from "fastify";
import { AppointmentService } from "./appointment.service";
import { ERROR_MESSAGES } from "../../core/constants/error-messages";

const appointmentService = new AppointmentService();

export class AppointmentController {
  async createAppointment(request: FastifyRequest, reply: FastifyReply) {
    const appointment = await appointmentService.createAppointment(
      request.body,
    );
    return reply.status(201).send({ appointment });
  }

  async completeAppointment(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number | string };
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return reply.status(400).send({
        error: "Validation Error",
        message: ERROR_MESSAGES.INVALID_APPOINTMENT_ID,
      });
    }

    const appointment = await appointmentService.completeAppointment(
      appointmentId,
      request.body,
    );
    return reply.status(200).send({ appointment });
  }

  async createPrescription(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number | string };
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return reply.status(400).send({
        error: "Validation Error",
        message: ERROR_MESSAGES.INVALID_APPOINTMENT_ID,
      });
    }

    const prescription = await appointmentService.createPrescription(
      appointmentId,
      request.body,
    );
    return reply.status(201).send({ prescription });
  }

  async getAppointmentById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number | string };
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return reply.status(400).send({
        error: "Validation Error",
        message: ERROR_MESSAGES.INVALID_APPOINTMENT_ID,
      });
    }

    const appointment =
      await appointmentService.getAppointmentById(appointmentId);

    if (!appointment) {
      return reply.status(404).send({
        error: "Not Found",
        message: ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
      });
    }

    return reply.status(200).send({ appointment });
  }

  async getAppointmentsByPatient(request: FastifyRequest, reply: FastifyReply) {
    const { patientId } = request.params as { patientId: number | string };
    const parsedPatientId = Number(patientId);

    if (Number.isNaN(parsedPatientId)) {
      return reply.status(400).send({
        error: "Validation Error",
        message: ERROR_MESSAGES.INVALID_PATIENT_ID,
      });
    }

    const appointments =
      await appointmentService.getAppointmentsByPatient(parsedPatientId);
    return reply.status(200).send({ appointments });
  }
}
