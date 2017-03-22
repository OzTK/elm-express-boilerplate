import { Request, Response, NextFunction } from "express"
import { BaseController, HttpMethod } from "./base-controller";
import BaseContext from "./base-context";

export default class Index extends BaseController {
  constructor() {
    super({ "/": HttpMethod.GET });
  }

  protected get(path: string, req: Request, res: Response, next: NextFunction): any {
    if (path == "/") {
      let ctx = new BaseContext("Home Page");
      ctx.currentPath = req.path;
      res.render("index", { context: ctx });
    }
  }
}