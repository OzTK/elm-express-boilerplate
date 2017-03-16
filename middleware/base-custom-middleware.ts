import { NextFunction, Request, Response, RequestHandler } from "express";

export abstract class BaseCustomMiddleware {
  middleware(): RequestHandler {
      return this.handler.bind(this);
  }
  abstract handler(req: Request, res: Response, next: NextFunction): void;
}