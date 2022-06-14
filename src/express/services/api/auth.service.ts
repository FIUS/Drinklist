import {Session} from '../../models/api/session';
import * as fs from 'fs';
import {IService} from '../service.interface';
import {authPath} from '../../main';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

interface AuthConfig {
  kiosk: string;
  admin: string;
}

export class AuthService implements IService {

  private auth: Map<string, boolean> = new Map<string, boolean>();
  private sessions: Map<string, Session> = new Map<string, Session>();

  private secret!: Buffer; // Assert to not-null because error in generator would throw

  constructor() {
    crypto.generateKey('hmac', {length: 256}, (err, key) => {
      if (err) {
        console.error('Could not generate secret for token signing!', err);
        throw err;
      }
      this.secret = key.export();
    });

    this.initAuth();
  }

  private initAuth(): void {
    const config = JSON.parse(fs.readFileSync(authPath, 'utf-8')) as AuthConfig;

    this.auth.set(config.kiosk, false);
    this.auth.set(config.admin, true);
  }

  shutdown(): Promise<void> {
    // Nothing to shut down
    return Promise.resolve();
  }

  private readonly createPayload = () => ({
    roles: [
      'user',
    ]
  });

  login(password: string, session: Session): boolean {
    if (!this.auth.has(password)) { // Password unknown/wrong
      console.log('[FAIL] [login] login attempt with wrong password');
      return false;
    }
    const payload = this.createPayload();
    if (this.auth.get(password) === true) { // Password has admin privileges
      payload.roles.push('admin');
    }

    session.token = jwt.sign(payload, this.secret, {jwtid: crypto.randomUUID()});

    this.sessions.set(session.token, session);

    // Login successful
    console.log(`[API] [ OK ] [login] login with roles ${payload.roles.toString()}`);
    return true;
  }

  logout(token: string): boolean {
    return this.sessions.delete(token);
  }

  isValid(token: string): boolean {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch (e) {
      return false;
    }
  }

  isRole(token: string, role: string): boolean {
    const payload = jwt.decode(token) as { roles: string[] };
    return payload.roles.includes(role);
  }

  isAdmin(token: string): boolean {
    return this.isValid(token) && this.isRole(token, 'admin');
  }

  getSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

}
