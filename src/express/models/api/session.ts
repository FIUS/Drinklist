export class Session {

  token?: string;

  constructor(
    public userAgent: string,
    public referrer: string,
    public clientIp: string,
  ) {
  }
}
