import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as hbs from "hbs";
import * as hbsUtilsFactory from "hbs-utils";

import { BaseHelper } from "./views/helpers/base-helper";
import { BaseCustomMiddleware } from "./middleware/base-custom-middleware";
import HandlebarsPlaceholderHelper from "./views/helpers/placeholder-helper";
import HandlebarsJsonHelper from "./views/helpers/json-helper";
import WebpackAssetsParser from "./middleware/webpack-assets-parser";
import { IApp } from 'app'

import Index from "./controller/index";
import Users from "./controller/users";

export default class App implements IApp {
  private app: express.Express;

  constructor() {
    this.app = express();
  }

  init(): express.Express {
    this.initViewEngine();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrors();

    return this.app;
  }

  private getHandlebarsHelpers(hbs: hbs.HBS): Array<BaseHelper> {
    // Put your custom handlebars helpers here
    return [
      new HandlebarsPlaceholderHelper(hbs),
      new HandlebarsJsonHelper(hbs)
    ];
  }

  private initViewEngine() {
    // hbs engine setup
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "hbs");
    const hbsUtils = hbsUtilsFactory(hbs);
    hbsUtils.registerWatchedPartials(path.join(__dirname, "views", "partials"));
    this.getHandlebarsHelpers(hbs).forEach(helper => {
      helper.register();
    });
  }

  private getCustomMiddlewares(): Array<BaseCustomMiddleware> {
    return [
      new WebpackAssetsParser()
    ];
  }

  private initMiddlewares() {
    this.app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "public")));
    
    // Custom middlewares
    this.getCustomMiddlewares().forEach(middleware => {
      this.app.use(middleware.middleware());
    });
  }

  private initRoutes() {
    this.app.use("/", new Index().getRouter());
    this.app.use(Users.BASE_PATH, new Users().getRouter());
  }

  private initErrors() {
        // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      const err = new Error("Not Found");
      res.status(404);
      next(err);
    });

    // error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  }
}
