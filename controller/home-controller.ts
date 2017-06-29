import { interfaces, Controller, Get } from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { Request, Response } from "express"
import BaseContext from "./base-context";
import TYPES from "../di/types"
import User from "../models/user";

@injectable()
@Controller(HomeController.BASE_PATH)
export default class HomeController implements interfaces.Controller {
  public static readonly TAG = "HomeController";
  public static readonly BASE_PATH = "/";
  private static readonly PATH_ROOT = "/";
  private static readonly PATH_HOME = "home";
  private static readonly PATH_OFFLINE = "offline";

  @Get(HomeController.PATH_ROOT)
  public async get(req: Request, res: Response) {
    let ctx = new BaseContext("Home Page");
    ctx.currentPath = req.path;
    return res.render("index", { context: ctx });
  }

  @Get(HomeController.PATH_OFFLINE)
  public async offline(req: Request, res: Response) {
    let ctx = new BaseContext("You are offline!");
    ctx.currentPath = req.path;
    return res.render("offline", { context: ctx });
  }
}

class HomeContext extends BaseContext {
  constructor() {
    super("My Friends");
  }
}