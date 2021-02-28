export class Token {
  constructor(
    public token: string,
    public root: boolean,
    public userAgent: string,
    public referrer: string,
    public clientIp: string,
  ) {
  }
}
