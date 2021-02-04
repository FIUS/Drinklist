import {NextFunction, Request, Response} from 'express';

export type NextHandleFunction = (req: Request, res: Response, next: NextFunction) => void;

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const state = req.header('x-auth-state');
  if (!state) {
    res.sendStatus(401);
    return;
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const state = req.header('x-auth-state');
  if (!state) {
    res.sendStatus(401);
    return;
  }
  if (state !== 'admin') {
    res.sendStatus(403);
    return;
  }
  next();
};
