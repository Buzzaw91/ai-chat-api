import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './user.entity'
import { NewUserDto } from './user.dto'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async register(newUser: NewUserDto): Promise<{ token: string }> {
    const user = await this.createUser(newUser)
    const token = await this.authService.createToken(user)
    return { token }
  }

  private async createUser(newUser: NewUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: newUser.email,
      },
    })
    if (existingUser) {
      throw new Error('Email already in use')
    }

    const passwordHash = await bcrypt.hash(newUser.password, 10)

    const user = this.userRepository.create({
      ...newUser,
      passwordHash,
    })

    return this.userRepository.save(user)
  }
}
