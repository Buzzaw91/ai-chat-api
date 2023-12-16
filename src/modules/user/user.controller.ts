import { Controller, Body, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import { NewUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Public route
  @Post('register')
  @UsePipes(ZodValidationPipe)
  async createUser(@Body() user: NewUserDto) {
    return await this.userService.register(user)
  }
}
