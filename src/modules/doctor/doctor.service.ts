import { PrismaClient } from "@prisma/client";
import {
  getDoctorsQuerySchema,
  getPatientsQuerySchema,
} from "../../database/doctor.schema";
import { USER_ROLE } from "../../core/enums";
import {
  parsePaginationQuery,
  createPaginationMeta,
  PaginatedResponse,
} from "../../types/pagination";

const prisma = new PrismaClient();

export class DoctorService {
  async getDoctors(query: unknown): Promise<PaginatedResponse<any>> {
    const { specialty, experience, limit, skip } =
      getDoctorsQuerySchema.parse(query);
    const { limit: parsedLimit, skip: parsedSkip } = parsePaginationQuery({
      limit,
      skip,
    });

    const where: any = {
      role: USER_ROLE.DOCTOR,
      ...(specialty && {
        doctorProfile: {
          specialty: {
            contains: specialty,
            mode: "insensitive",
          },
        },
      }),
    };

    if (experience !== undefined) {
      where.doctorProfile = {
        ...where.doctorProfile,
        experience: {
          gte: experience,
        },
      };
    }

    const [doctors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          doctorProfile: true,
        },
        take: parsedLimit,
        skip: parsedSkip,
        orderBy: {
          firstName: "asc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: doctors,
      pagination: createPaginationMeta(total, parsedLimit, parsedSkip),
    };
  }

  async getPatients(query: unknown): Promise<PaginatedResponse<any>> {
    const { limit, skip } = getPatientsQuerySchema.parse(query);
    const { limit: parsedLimit, skip: parsedSkip } = parsePaginationQuery({
      limit,
      skip,
    });

    const where = {
      role: USER_ROLE.PATIENT,
    };

    const [patients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        take: parsedLimit,
        skip: parsedSkip,
        orderBy: {
          firstName: "asc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: patients,
      pagination: createPaginationMeta(total, parsedLimit, parsedSkip),
    };
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
