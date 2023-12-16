import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
})

export class LoginDto extends createZodDto(LoginSchema) {}
