import { PrismaClient } from "@prisma/client";
import { completeAppointmentSchema, createAppointmentSchema, createPrescriptionSchema } from "../database/appointment.schema";
import { APPOINTMENT_STATUS, USER_ROLE } from "../core/enums";

const prisma = new PrismaClient();

export class AppointmentService {
  async createAppointment(data: unknown) {
    const appointmentData = createAppointmentSchema.parse(data);

    const startTime = new Date(appointmentData.startTime);
    const endTime = new Date(appointmentData.endTime);
    const now = new Date();

    if (startTime <= now) {
      throw new Error("Cannot book appointments in the past");
    }

    if (endTime <= startTime) {
      throw new Error("End time must be after start time");
    }

    const doctor = await prisma.user.findFirst({
      where: {
        id: appointmentData.doctorId,
        role: USER_ROLE.DOCTOR,
      },
    });

    if (!doctor) {
      throw new Error("The specified doctor does not exist");
    }

    const patient = await prisma.user.findFirst({
      where: {
        id: appointmentData.patientId,
        role: USER_ROLE.PATIENT,
      },
    });

    if (!patient) {
      throw new Error("The specified patient does not exist");
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
      throw new Error("The doctor is already booked at this time");
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
      throw new Error("The specified appointment does not exist");
    }

    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) {
      throw new Error("Only scheduled appointments can be completed");
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
      throw new Error("The specified appointment does not exist");
    }

    if (appointment.status !== APPOINTMENT_STATUS.COMPLETED) {
      throw new Error(
        "Prescriptions can only be created for completed appointments",
      );
    }

    const existingPrescription = await prisma.prescription.findFirst({
      where: { appointmentId },
    });

    if (existingPrescription) {
      throw new Error("A prescription already exists for this appointment");
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
