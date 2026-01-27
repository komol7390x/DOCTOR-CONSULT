import { PrismaClient } from "@prisma/client";
import {
  createAppointmentSchema,
  completeAppointmentSchema,
  createPrescriptionSchema,
} from "../../database/appointment.schema";
import { USER_ROLE, APPOINTMENT_STATUS } from "../../core/enums";
import { ERROR_MESSAGES } from "../../core/constants/error-messages";

const prisma = new PrismaClient();

export class AppointmentService {
  async createAppointment(data: unknown) {
    const appointmentData = createAppointmentSchema.parse(data);

    const startTime = new Date(appointmentData.startTime);
    const endTime = new Date(appointmentData.endTime);
    const now = new Date();

    if (startTime <= now) {
      throw new Error(ERROR_MESSAGES.APPOINTMENT_PAST_BOOKING);
    }

    if (endTime <= startTime) {
      throw new Error(ERROR_MESSAGES.APPOINTMENT_INVALID_TIME);
    }

    const doctor = await prisma.user.findFirst({
      where: {
        id: appointmentData.doctorId,
        role: USER_ROLE.DOCTOR,
      },
    });

    if (!doctor) {
      throw new Error(ERROR_MESSAGES.DOCTOR_NOT_FOUND);
    }

    const patient = await prisma.user.findFirst({
      where: {
        id: appointmentData.patientId,
        role: USER_ROLE.PATIENT,
      },
    });

    if (!patient) {
      throw new Error(ERROR_MESSAGES.PATIENT_NOT_FOUND);
    }

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: appointmentData.doctorId,
        status: APPOINTMENT_STATUS.SCHEDULED,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new Error(ERROR_MESSAGES.APPOINTMENT_DOCTOR_BUSY);
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        startTime,
        endTime,
        notes: appointmentData.notes,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            doctorProfile: true,
          },
        },
      },
    });

    return appointment;
  }

  async completeAppointment(id: number, data: unknown) {
    const { notes } = completeAppointmentSchema.parse(data);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new Error(ERROR_MESSAGES.APPOINTMENT_NOT_FOUND);
    }

    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) {
      throw new Error(ERROR_MESSAGES.APPOINTMENT_ALREADY_COMPLETED);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: APPOINTMENT_STATUS.COMPLETED,
        notes: notes || appointment.notes,
      },
    });

    return updatedAppointment;
  }

  async createPrescription(appointmentId: number, data: unknown) {
    const prescriptionData = createPrescriptionSchema.parse(data);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error(ERROR_MESSAGES.APPOINTMENT_NOT_FOUND);
    }

    if (appointment.status !== APPOINTMENT_STATUS.COMPLETED) {
      throw new Error(ERROR_MESSAGES.PRESCRIPTION_INCOMPLETE_APPOINTMENT);
    }

    const existingPrescription = await prisma.prescription.findFirst({
      where: { appointmentId },
    });

    if (existingPrescription) {
      throw new Error(ERROR_MESSAGES.PRESCRIPTION_ALREADY_EXISTS);
    }

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        diagnosis: prescriptionData.diagnosis,
        instructions: prescriptionData.instructions,
        medications: {
          create: prescriptionData.medications,
        },
      },
      include: {
        medications: true,
      },
    });

    return prescription;
  }

  async getAppointmentById(id: number) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            doctorProfile: true,
          },
        },
        prescriptions: {
          include: {
            medications: true,
          },
        },
      },
    });

    return appointment;
  }

  async getAppointmentsByPatient(patientId: number) {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            doctorProfile: true,
          },
        },
        prescriptions: {
          include: {
            medications: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return appointments;
  }
}
