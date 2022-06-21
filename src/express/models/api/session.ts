import * as jwt from 'jsonwebtoken';

export class Session {

  token?: string;

  constructor(
    public userAgent: string,
    public referrer: string,
    public clientIp: string,
  ) {
  }

  get id(): string | undefined {
    if (!this.token) {
      return undefined;
    }
    return jwt.decode(this.token, {json: true})?.jti;
  }

  clone(): Session {
    const session = new Session(this.userAgent, this.referrer, this.clientIp);
    session.token = this.token;
    return session;
  }
}
