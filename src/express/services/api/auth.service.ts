import Session from '../../models/api/session';
import * as fs from 'fs';
import IService from '../service.interface';

interface AuthConfig {
  kiosk: string;
  admin: string;
}

class AuthService implements IService {

  private auth: Map<string, boolean> = new Map<string, boolean>();
  private sessions: Map<string, Session> = new Map<string, Session>();

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    const root = fs.realpathSync('./');
    const config = JSON.parse(fs.readFileSync(`${root}/data/auth.json`, 'utf-8')) as AuthConfig;

    this.auth.set(config.kiosk, false);
    this.auth.set(config.admin, true);
  }

  shutdown(): Promise<void> {
    // Nothing to shutdown
    return Promise.resolve();
  }

  login(password: string, session: Session): boolean {
    if (!this.auth.has(password)) { // Password unknown/wrong
      console.log('[FAIL] [login] login attempt with wrong password');
      return false;
    }
    if (this.auth.get(password) === true) { // Password is admin
      session.root = true;
    }
    this.sessions.set(session.token, session);

    // Login successful
    console.log(`[API] [ OK ] [login] login with token ${session.token}`);
    return true;
  }

  logout(token: string): boolean {
    return this.sessions.delete(token);
  }

  isValid(token: string): boolean {
    return this.sessions.has(token);
  }

  isAdmin(token: string): boolean {
    return this.isValid(token) && (this.sessions.get(token)?.root || false);
  }

  getSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

}

export default AuthService;
