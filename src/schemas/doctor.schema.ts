import { z } from 'zod';

export const getDoctorsQuerySchema = z.object({
  specialty: z.string().optional(),
});

export const doctorResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  role: z.enum(['DOCTOR', 'PATIENT']),
  doctorProfile: z.object({
    id: z.string(),
    specialty: z.string(),
    experience: z.number().nullable(),
    consultationPrice: z.number(),
    description: z.string().nullable(),
  }).nullable(),
});

export const getDoctorsResponseSchema = z.object({
  doctors: z.array(doctorResponseSchema),
});
