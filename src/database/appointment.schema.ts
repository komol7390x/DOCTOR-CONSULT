import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
});

export const completeAppointmentSchema = z.object({
  notes: z.string().optional(),
});

export const createPrescriptionSchema = z.object({
  diagnosis: z.string(),
  instructions: z.string(),
  medications: z.array(
    z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string(),
      notes: z.string().optional(),
    }),
  ),
});

export const medicationItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  duration: z.string(),
  notes: z.string().nullable(),
});

export const prescriptionSchema = z.object({
  id: z.number(),
  appointmentId: z.number(),
  patientId: z.number(),
  doctorId: z.number(),
  diagnosis: z.string(),
  instructions: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  medications: z.array(medicationItemSchema),
});

export const appointmentSchema = z.object({
  id: z.number(),
  patientId: z.number(),
  doctorId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const appointmentWithRelationsSchema = appointmentSchema.extend({
  patient: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  }),
  doctor: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    doctorProfile: z
      .object({
        id: z.number(),
        specialty: z.string(),
        experience: z.number().nullable(),
        consultationPrice: z.number(),
        description: z.string().nullable(),
      })
      .nullable(),
  }),
});
