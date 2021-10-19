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

export const asyncHandler = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req, res, next)).catch(next);
};

export class RequestError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message);
  }
}
