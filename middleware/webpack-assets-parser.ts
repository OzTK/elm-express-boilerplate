import { NextFunction, Request, Response } from "express";
import { BaseCustomMiddleware } from "./base-custom-middleware"

export default class WebpackAssetsParser extends BaseCustomMiddleware {
    private static readonly jsonPath = "../webpack-assets.json";

    parse() {
        return require(WebpackAssetsParser.jsonPath);
    }

    handler(req: Request, res: Response, next: NextFunction): void {
        res.locals.assets = this.parse();
        next();
    }
}