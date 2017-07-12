import { ErrorRequestHandler, RequestHandler, Request, Response } from "express";
import { Winston, TransportInstance } from "winston";

export declare function errorLogger(options: winstonExpressMiddleware.Options) : ErrorRequestHandler;
export declare function logger(options: winstonExpressMiddleware.LoggerOptions) : RequestHandler;

export declare namespace winstonExpressMiddleware {
  interface Options {
    transports?: TransportInstance[];
    winstonInstance?: Winston;
    levels?: string;
    statusLevels?: boolean;
    skip?: (req: Request, res: Response) => boolean;
  }
  interface LoggerOptions extends Options {
    meta?: boolean;
    msg?: string;
    expressFormat?: boolean;
    colorStatus?: boolean;
    ignoreRoute?: () => boolean;
  }
}