import { User } from '../user/user.entity'

export interface JwtPayload {
  readonly id: number
  readonly tokenId: string
}
export interface RequestUser extends User {
  tokenId: string
}
