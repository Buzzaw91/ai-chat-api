export interface LoginParams {
  readonly email: string
  readonly password: string
}

export interface JwtPayload {
  readonly id: number
  readonly role: string
  readonly tokenId?: number
}
