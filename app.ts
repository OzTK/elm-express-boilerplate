import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import { json, urlencoded } from "body-parser";
import * as hbs from "hbs";
import * as hbsUtilsFactory from "hbs-utils";
import * as helmet from "helmet";
import * as cors from "cors";
import { InversifyExpressServer } from "inversify-express-utils";

import { BaseHelper } from "./views/helpers/base-helper";
import { BaseCustomMiddleware } from "./middleware/base-custom-middleware";
import HandlebarsPlaceholderHelper from "./views/helpers/placeholder-helper";
import HandlebarsJsonHelper from "./views/helpers/json-helper";
import WebpackAssetsParser from "./middleware/webpack-assets-parser";
import { IApp } from 'app';
import getContainer from "./di/container";
import HttpError from "./models/http-error";

export default class App implements IApp {
  private static app: IApp;

  private server: InversifyExpressServer;
  private config: any;

  constructor() {
    this.initServer();
  }

  static getInstance(): IApp {
    if (!App.app) {
      App.app = new App();
    }

    return App.app;
  }

  getConfig(): any {
    return this.config;
  }

  start(port: string | number): void {
    this.server.build().listen(port);
  }

  private initServer(): void {
    let app = express();
    this.config = this.loadConfig(app);
    
    let container = getContainer(this.config);
    this.server = new InversifyExpressServer(container, null, null, app);

    this.server.setConfig(app => {
      this.initViewEngine(app);
      this.initMiddlewares(app);
    });

    this.server.setErrorConfig(app => {
      this.initErrors(app);
    });
  }

  private loadConfig(app: express.Application): any {
    return app.get("env") === "development" ? require("./config.dev.json") : require("./config.json");
  }

  private getHandlebarsHelpers(hbs: hbs.HBS): Array<BaseHelper> {
    // Put your custom handlebars helpers here
    return [
      new HandlebarsPlaceholderHelper(hbs),
      new HandlebarsJsonHelper(hbs)
    ];
  }

  private initViewEngine(app: express.Application) {
    // hbs engine setup
    app.set("views", join(__dirname, "views"));
    app.set("view engine", "hbs");
    const hbsUtils = hbsUtilsFactory(hbs);
    hbsUtils.registerWatchedPartials(join(__dirname, "views", "partials"));
    this.getHandlebarsHelpers(hbs).forEach(helper => {
      helper.register();
    });
  }

  private getCustomMiddlewares(): Array<BaseCustomMiddleware> {
    return [
      new WebpackAssetsParser()
    ];
  }

  private initMiddlewares(app: express.Application) {
    app.use(favicon(join(__dirname, "public", "favicon.ico")));
    app.use(logger("dev"));
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(helmet());
    app.use(cors());
    app.use(express.static(join(__dirname, "public")));

    app.get("/cache.manifest", (req : express.Request, res : express.Response, next : express.NextFunction) => {
      res.setHeader("Content-Type", "text/cache-manifest");
      next();
    });
    
    // Custom middlewares
    this.getCustomMiddlewares().forEach(middleware => {
      app.use(middleware.middleware());
    });
  }

  private initErrors(app: express.Application) {
    app.use((req, res, next) => {
      const err = new HttpError(404, "This url does not exist");
      next(err);
    });

    // error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status || 500);

      if (req.header("Accept") === "application/json") {
        res.statusMessage = err.message;
        res.end();
        return;
      }

      res.locals.message = err.message;
      // set locals, only providing error in development
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.render("error");
    });
  }
}
