export class Session {
  constructor(
    public token: string,
    public userAgent: string,
    public referrer: string,
    public clientIp: string,
  ) {
  }
}
