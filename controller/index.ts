import { Request, Response, NextFunction } from "express"
import { BaseRoute, HttpMethod } from "./base-route";
import BaseContext from "./base-context";

export default class Index extends BaseRoute {
  constructor() {
    super({ "/": HttpMethod.GET });
  }

  protected get(path: string, req: Request, res: Response, next: NextFunction): any {
    let ctx = new BaseContext("Home Page");
    ctx.currentPath = req.path;
    res.render("index", { context: ctx });
  };
}