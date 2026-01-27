import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client';
import { 
  createAppointmentSchema, 
  completeAppointmentSchema, 
  createPrescriptionSchema 
} from '../schemas/appointment.schema';

const prisma = new PrismaClient();

export class AppointmentService {
  async createAppointment(data: unknown) {
    const appointmentData = createAppointmentSchema.parse(data);
    
    const startTime = new Date(appointmentData.startTime);
    const endTime = new Date(appointmentData.endTime);
    const now = new Date();

    // Validate time logic
    if (startTime <= now) {
      throw new Error('Cannot book appointments in the past');
    }

    if (endTime <= startTime) {
      throw new Error('End time must be after start time');
    }

    // Check if doctor exists and is a doctor
    const doctor = await prisma.user.findFirst({
      where: {
        id: appointmentData.doctorId,
        role: UserRole.DOCTOR,
      },
    });

    if (!doctor) {
      throw new Error('The specified doctor does not exist');
    }

    // Check if patient exists and is a patient
    const patient = await prisma.user.findFirst({
      where: {
        id: appointmentData.patientId,
        role: UserRole.PATIENT,
      },
    });

    if (!patient) {
      throw new Error('The specified patient does not exist');
    }

    // Check for time conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: appointmentData.doctorId,
        status: AppointmentStatus.SCHEDULED,
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
      throw new Error('The doctor is already booked at this time');
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

  async completeAppointment(id: string, data: unknown) {
    const { notes } = completeAppointmentSchema.parse(data);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new Error('The specified appointment does not exist');
    }

    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Only scheduled appointments can be completed');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.COMPLETED,
        notes: notes || appointment.notes,
      },
    });

    return updatedAppointment;
  }

  async createPrescription(appointmentId: string, data: unknown) {
    const prescriptionData = createPrescriptionSchema.parse(data);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('The specified appointment does not exist');
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new Error('Prescriptions can only be created for completed appointments');
    }

    // Check if prescription already exists for this appointment
    const existingPrescription = await prisma.prescription.findFirst({
      where: { appointmentId },
    });

    if (existingPrescription) {
      throw new Error('A prescription already exists for this appointment');
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

  async getAppointmentById(id: string) {
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

  async getAppointmentsByPatient(patientId: string) {
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
        startTime: 'desc',
      },
    });

    return appointments;
  }
}
