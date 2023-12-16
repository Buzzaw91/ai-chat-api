import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import { JwtPayload } from './auth.interface'

const jwtExtractor = (req) => {
  if (req && req.cookies && req.cookies['XSRF-TOKEN']) {
    // Read from cookies
    return req.cookies['XSRF-TOKEN']
  } else {
    // Fallback to header bearer
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req)
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: jwtExtractor,
      secretOrKey: `${process.env.JWT_SECRET}`,
    })
  }

  async validate(
    payload: JwtPayload,
  ): Promise<JwtPayload | UnauthorizedException> {
    const user = await this.authService.validateUser(payload)
    if (!user) throw new UnauthorizedException()
    return { ...user, tokenId: payload.tokenId }
  }
}
