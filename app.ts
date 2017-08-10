import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import {
  errorLogger,
  logger,
  winstonExpressMiddleware,
} from "winston-express-middleware";
import { TransportInstance, transports } from "winston";
import "winston-daily-rotate-file";
import * as fs from "fs";
import { json, urlencoded } from "body-parser";
import * as hbs from "hbs";
import * as hbsUtilsFactory from "hbs-utils";
import * as helmet from "helmet";
import * as cors from "cors";
import { inject } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import TYPES from "./di/types";

import { BaseCustomMiddleware } from "./middleware/base-custom-middleware";
import WebpackAssetsParser from "./middleware/webpack-assets-parser";
import { IApp } from "app";
import getContainer from "./di/container";
import HttpError from "./http-error";
import {
  configure as initElmViewEngine,
  Options as ElmOptions,
} from "elm-view-engine";
import HotModuleReloading from "./di/hot-module-reloading";

import * as webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as config from "config";

export default class App implements IApp {
  private static readonly logDirectory = join(__dirname, "log");
  private static app: IApp;

  private server: InversifyExpressServer;

  static getInstance(): IApp {
    if (!App.app) {
      App.app = new App();
    }

    return App.app;
  }

  constructor(@inject(TYPES.HotModuleReloading) private readonly hmr?: HotModuleReloading) {}

  async start(port: string | number): Promise<void> {
    await this.initServer();
    this.server.build().listen(port);
  }

  private async initServer(): Promise<void> {
    let app = express();
    app.use(this.setupLogging(LoggingTypes.Http));

    let container = getContainer();

    console.debug("Compiling views...")
    await initElmViewEngine(
      new ElmOptions(join(__dirname, "views"), __dirname, app),
    );
    console.debug("Done compiling!")

    this.server = new InversifyExpressServer(container, null, null, app);
    this.server.setConfig(this.initMiddlewares.bind(this));
    this.server.setErrorConfig(this.initErrors.bind(this));
  }

  private getCustomMiddlewares(): Array<BaseCustomMiddleware> {
    return [new WebpackAssetsParser()];
  }

  private initMiddlewares(app: express.Application) {
    app
      .use(favicon(join(__dirname, "public", "favicon.ico")))
      .use(json())
      .use(urlencoded({ extended: false }))
      .use(helmet())
      .use(cors())
      .use(express.static(join(__dirname, "public")));

    if (this.hmr) {
      this.hmr.setup(app);
    }

    // Custom middlewares
    this.getCustomMiddlewares().forEach(middleware => {
      app.use(middleware.middleware());
    });
  }

  private setupLogging(
    loggingType: LoggingTypes,
  ): express.RequestHandler | express.ErrorRequestHandler {
    let transport: TransportInstance;

    if (config.get("env.production")) {
      let fname: string;
      let dname: string;

      switch (loggingType) {
        case LoggingTypes.Http:
          fname = "requests";
          dname = "http";
          break;
        case LoggingTypes.Error:
          fname = "errors";
          dname = "error";
          break;

        default:
          fname = "logs";
          dname = "log";
          break;
      }

      fs.existsSync(App.logDirectory) || fs.mkdirSync(App.logDirectory);
      const dir = join(App.logDirectory, dname);
      fs.existsSync(dir) || fs.mkdirSync(dir);
      transport = new transports.DailyRotateFile({
        filename: join(dir, fname),
        datePattern: "_yyyy-MM-dd.txt",
      });
    } else {
      transport = new transports.Console({ colorize: true });
    }

    return loggingType == LoggingTypes.Http
      ? logger({ transports: [transport], expressFormat: true })
      : errorLogger({ transports: [transport] });
  }

  private initErrors(app: express.Application) {
    app.use((req, res, next) => {
      const err = new HttpError(404, "This url does not exist");
      next(err);
    });

    // Error logger
    app.use(this.setupLogging(LoggingTypes.Error));

    // error handler
    app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        res.status(err.status || 500);

        if (req.header("Accept") === "application/json") {
          res.statusMessage = err.message;
          res.end();
          return;
        }

        res.locals.message = "Impossible to access this page";
        // set locals, only providing error in development
        res.locals.error = config.get("env.production") ? null : err;

        // rendering the error page
        res.render("ErrorView");
      },
    );
  }
}

const enum LoggingTypes {
  Http,
  Error,
}