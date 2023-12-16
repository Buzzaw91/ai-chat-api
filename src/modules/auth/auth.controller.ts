import {
  Controller,
  Body,
  Post,
  UsePipes,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ZodValidationPipe } from 'nestjs-zod'
import { Response, Request } from 'express'
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

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() request: Request, @Res() response: Response) {
    const result = await this.authService.logout(request)

    response.json(result)
  }
}
