import { v4 as uuidv4 } from 'uuid'
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

  async createToken(user: any): Promise<string> {
    // Generate 16 character random code
    const tokenId: string = uuidv4()

    // Compose jwt payload
    const payload: JwtPayload = { tokenId, id: user.id }

    // Create jwt token from given payload
    const token = this.jwtService.sign(payload)
    // Save valid token to db with the uuid so it can be revoked if necessary
    await this.authTokenRepository.save({ id: tokenId, userId: user.id })
    return token
  }

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
