import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address').min(5, 'Email too short'),
  password: z
    .string()
    .min(8, 'Password too short')
    .max(28, 'Password too long'),
});

export class LoginDto extends createZodDto(LoginSchema) {}
