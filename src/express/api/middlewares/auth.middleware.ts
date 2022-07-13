import {NextHandleFunction} from '../api.util';
import AuthService from '../../services/api/auth.service';

class AuthMiddleware {
  static token(auth: AuthService): NextHandleFunction {
    return (req, res, next) => {
      const token = req.header('x-auth-token');
      if (!token || !auth.isValid(token)) {
        return next();
      }
      req.headers['x-auth-state'] = auth.isAdmin(token) ? 'admin' : 'user';
      next();
    };
  }
}

export default AuthMiddleware;
