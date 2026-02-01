import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const adminBodyZod = z.object({
  username: z.string().trim().min(3).max(128).nonempty(),
  fullname: z.string().trim().min(3).max(128).nonempty(),
  password: z
    .string()
    .min(8)
    .regex(/^[a-zA-Z0-9]+$/),
  phoneNumber: z
    .string()
    .regex(/^\+998\d{9}$/)
    .nonempty()
});

export const createSchema = {
  body: zodToJsonSchema(adminBodyZod as any),
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' }
      }
    }
  }
};

export type CreateAdmin = z.infer<typeof adminBodyZod>;

export const loginSchema = {
  body: z.object({
    username: z.string().trim().min(1, 'Username is required'),

    password: z.string().min(1, 'Password is required')
  })
};

export type LoginInput = z.infer<typeof loginSchema.body>;
