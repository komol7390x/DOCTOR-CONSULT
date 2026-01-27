import { PrismaClient, UserRole } from '@prisma/client';
import { getDoctorsQuerySchema } from '../schemas/doctor.schema';

const prisma = new PrismaClient();

export class DoctorService {
  async getDoctors(query: unknown) {
    const { specialty } = getDoctorsQuerySchema.parse(query);

    const doctors = await prisma.user.findMany({
      where: {
        role: UserRole.DOCTOR,
        ...(specialty && {
          doctorProfile: {
            specialty: {
              contains: specialty,
              mode: 'insensitive',
            },
          },
        }),
      },
      include: {
        doctorProfile: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        doctorProfile: true,
      },
    });

    return { doctors };
  }

  async getDoctorById(id: string) {
    const doctor = await prisma.user.findFirst({
      where: {
        id,
        role: UserRole.DOCTOR,
      },
      include: {
        doctorProfile: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        doctorProfile: true,
      },
    });

    return doctor;
  }

  async getDoctorAppointments(doctorId: string) {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
      },
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
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return appointments;
  }
}
