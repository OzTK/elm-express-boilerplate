import { Request, Response, NextFunction } from "express"
import { RouteBase, Method } from "./route-base";
import BaseContext from "./base-context";

export default class Index extends RouteBase {
  constructor() {
    super({ "/": Method.GET });
  }

  protected get(path: string, req: Request, res: Response, next: NextFunction): any {
    let ctx = new BaseContext("Home Page");
    ctx.currentPath = req.path;
    res.render("index", { context: ctx });
  };
}