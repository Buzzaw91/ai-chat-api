import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const NewUserSchema = z.object({
  email: z.string().email('Invalid email address').min(5, 'Email too short'),
  firstName: z.string(),
  lastName: z.string(),
  password: z
    .string()
    .min(8, 'Password too short')
    .max(28, 'Password too long'),
})

export class NewUserDto extends createZodDto(NewUserSchema) {}
