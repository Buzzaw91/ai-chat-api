import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt'
import { Request } from 'express'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthToken } from './auth.entity'
import { User } from '../user/user.entity'
import { JwtPayload, RequestUser } from './auth.interface'
import { LoginDto } from './auth.dto'

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

  async login(params: LoginDto): Promise<{ token: string; user: User }> {
    const { email, password } = params

    const userPw = await this.userRepository.findOne({
      where: {
        email,
        active: true,
      },
      select: ['id', 'passwordHash'],
    })

    const user = await this.userRepository.findOne({
      where: {
        email,
        active: true,
      },
    })

    if (userPw && user) {
      const loginSuccess = await bcrypt.compare(password, userPw.passwordHash)
      if (loginSuccess) {
        const token = await this.createToken(user)
        return {
          token,
          user,
        }
      }
    }
    throw new BadRequestException('Invalid credentials')
  }

  async logout(request: Request): Promise<any> {
    const user = request.user as RequestUser

    // Validate user and tokenId
    if (!user || !user.tokenId) {
      throw new UnauthorizedException('Invalid user or token data')
    }

    try {
      const deleteResult = await this.authTokenRepository.delete({
        id: user.tokenId,
      })

      if (!deleteResult.affected) {
        throw new InternalServerErrorException('Token deletion failed')
      }
      return deleteResult
    } catch (error) {
      throw new InternalServerErrorException('An error occurred during logout')
    }
  }
}
