import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { User } from '../user/user.entity'
import { AuthToken } from './auth.entity'
import APP_CONFIG from '../../app.config'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: `${process.env.JWT_SECRET}`,
        signOptions: {
          expiresIn: APP_CONFIG.jwt.expireTimes.mobile,
        },
      }),
    }),
    TypeOrmModule.forFeature([User, AuthToken]),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
