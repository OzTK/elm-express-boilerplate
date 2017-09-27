import { interfaces, controller, httpGet } from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import BaseContext from "./base-context";

@injectable()
@controller(HomeController.BASE_PATH)
export default class HomeController implements interfaces.Controller {
  public static readonly TAG = "HomeController";
  public static readonly BASE_PATH = "/";
  private static readonly PATH_ROOT = "/";
  private static readonly PATH_HOME = "home";

  @httpGet(HomeController.PATH_ROOT)
  public async get(req: Request, res: Response) {
    let ctx = new BaseContext("Home Page");
    return res.render("HomeView", { context: ctx });
  }
}
