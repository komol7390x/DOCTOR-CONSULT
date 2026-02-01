import { z } from 'zod';

export const createSchema = {
  body: z.object({
    username: z.string().trim().min(3, 'Username must be at least 3 characters').max(128, 'Username too long').nonempty('Username is required'),
    fullname: z.string().trim().min(3, 'Full name must be at least 3 characters').max(128, 'Full name too long').nonempty('Full name is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Password must contain only letters and numbers'),

    phoneNumber: z
      .string()
      .regex(/^\+998\d{9}$/, 'Invalid phone number format (e.g., +998901234567)')
      .nonempty('Phone number is required')
  })
};
export type CreateAdmin = z.infer<typeof createSchema>;

export const loginSchema = {
  body: z.object({
    username: z.string().trim().min(1, 'Username is required'),

    password: z.string().min(1, 'Password is required')
  })
};

export type LoginInput = z.infer<typeof loginSchema.body>;
