import { Controller, Body, Post, UsePipes, Res } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ZodValidationPipe } from 'nestjs-zod'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  async login(
    @Body()
    loginDto: LoginDto,
    @Res() response: Response,
  ) {
    const result = await this.authService.login(loginDto)

    response.json(result)
  }
}
