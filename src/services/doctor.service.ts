import { PrismaClient } from "@prisma/client";
import { USER_ROLE } from "../core/enums";
import { getDoctorsQuerySchema } from "../database/doctor.schema";


const prisma = new PrismaClient();

export class DoctorService {
  async getDoctors(query: unknown) {
    const { specialty } = getDoctorsQuerySchema.parse(query);

    const doctors = await prisma.user.findMany({
      where: {
        role: USER_ROLE.DOCTOR,
        ...(specialty && {
          doctorProfile: {
            specialty: {
              contains: specialty,
            },
          },
        }),
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

  async getDoctorById(id: number) {
    const doctor = await prisma.user.findFirst({
      where: {
        id,
        role: USER_ROLE.DOCTOR,
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

  async getDoctorAppointments(doctorId: number) {
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
        startTime: "asc",
      },
    });

    return appointments;
  }
}
