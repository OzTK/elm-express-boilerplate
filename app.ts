import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { errorLogger, logger, winstonExpressMiddleware } from "winston-express-middleware";
import { TransportInstance, transports } from "winston";
import "winston-daily-rotate-file";
import * as fs from "fs";
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
import HttpError from "./http-error";

import * as webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";

export default class App implements IApp {
  private static readonly logDirectory = join(__dirname, "log");
  private static app: IApp;

  private server: InversifyExpressServer;
  
  public get config() : any {
    return this._config;
  }

  constructor(private _config: any) {
    this.initServer();
  }

  static getInstance(options?: any): IApp {
    if (!App.app) {
      App.app = new App(options);
    }

    return App.app;
  }

  start(port: string | number): void {
    this.server.build().listen(port);
  }

  private initServer(): void {
    let app = express();
    app.use(this.setupLogging(LoggingTypes.Http));
    
    let container = getContainer(this.config);
    this.server = new InversifyExpressServer(container, null, null, app);

    this.server.setConfig(confApp => {
      this.initViewEngine(confApp);
      this.initMiddlewares(confApp);
    });

    this.server.setErrorConfig(confApp => {
      this.initErrors(confApp);
    });
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
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(helmet());
    app.use(cors());
    app.use(express.static(join(__dirname, "public")));

    if (this.config.env.hot) {
      this.initHMR(app);
    }

    // Custom middlewares
    this.getCustomMiddlewares().forEach(middleware => {
      app.use(middleware.middleware());
    });
  }

  private setupLogging(loggingType: LoggingTypes): express.RequestHandler | express.ErrorRequestHandler {
    let transport: TransportInstance;

    if (this.config.env.prod) {
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

      const dir = join(App.logDirectory, dname);
      fs.existsSync(dir) || fs.mkdirSync(dir);
      transport = new transports.DailyRotateFile({
        filename: join(dir, fname),
        datePattern: "_yyyy-MM-dd.txt"
      });
    } else {
      transport = new transports.Console({ colorize: true });
    }

    return loggingType == LoggingTypes.Http
      ? logger({ transports: [ transport ], expressFormat: true })
      : errorLogger({ transports: [ transport ] });
  }

  private initHMR(app: express.Application) {
      const wpConfig = require("./webpack.config.js")(this.config.env);
      const compiler = webpack(wpConfig);
      app.use(webpackDevMiddleware(compiler, { publicPath: wpConfig.output.publicPath, stats: { colors: true } }));
      app.use(webpackHotMiddleware(compiler, { path: "/__webpack_hmr", heartbeat: 10 * 1000 }));
  }

  private initErrors(app: express.Application) {
    app.use((req, res, next) => {
      const err = new HttpError(404, "This url does not exist");
      next(err);
    });
    
    // Error logger
    app.use(this.setupLogging(LoggingTypes.Error));

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
      res.locals.error = this.config.env.prod ? {} : err;

      // render the error page
      res.render("error");
    });
  }
}

const enum LoggingTypes {
  Http,
  Error
}
