import { z } from "zod";

export const getDoctorsQuerySchema = z.object({
  specialty: z.string().optional(),
  experience: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
});

export const getPatientsQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
});

export const doctorResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  role: z.enum(["DOCTOR", "PATIENT"]),
  doctorProfile: z
    .object({
      id: z.number(),
      specialty: z.string(),
      experience: z.number().nullable(),
      consultationPrice: z.number(),
      description: z.string().nullable(),
    })
    .nullable(),
});

export const getDoctorsResponseSchema = z.object({
  doctors: z.array(doctorResponseSchema),
});
