import { NextFunction, Request, Response } from "express";
import { BaseCustomMiddleware } from "./base-custom-middleware";
import App from "../app";

export default class WebpackAssetsParser extends BaseCustomMiddleware {
  private static readonly jsonPath = "../webpack-assets.json";

  parse() {
    return require(WebpackAssetsParser.jsonPath);
  }

  handler(req: Request, res: Response, next: NextFunction): void {
    try {
      res.locals.assets = this.parse();
      next();
    } catch (err) {
      next(err);
    }
  }
}
