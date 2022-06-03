import {v4 as uuidV4} from 'uuid';

export class Session {

  token: string;
  root = false;

  constructor(
    public userAgent: string,
    public referrer: string,
    public clientIp: string,
  ) {
    this.token = uuidV4();
  }
}
