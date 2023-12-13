import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const LoginSchema = z.object({
  username: z.string().min(3).max(24),
  password: z.string().min(8).max(28),
});

export class LoginDto extends createZodDto(LoginSchema) {}
