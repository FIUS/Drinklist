export interface JwtClaims {
  jti: string,
  iat: number,
  roles: string[]
}
