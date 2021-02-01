export class Token {
  constructor(
    public token: string,
    public root: boolean,
    public useragent: string,
    public referrer: string,
    public userip: string,
  ) {
  }
}
