import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthToken } from './auth.entity'
import { User } from '../user/user.entity'
import { JwtPayload } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload) {
    // Check that token exists
    const token = await this.authTokenRepository.findOne({
      where: {
        id: payload.tokenId,
      },
    })

    if (token) {
      const user = await this.userRepository.findOne({
        where: { id: token.userId },
      })
      if (!user || !user.active) return false

      return {
        ...payload,
        me: user,
      }
    }
    return false
  }
}
