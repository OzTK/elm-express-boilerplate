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

import * as webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";

export default class App implements IApp {
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

    if (this.config.env.hot) {
      this.initHMR(app);
    }

    // Custom middlewares
    this.getCustomMiddlewares().forEach(middleware => {
      app.use(middleware.middleware());
    });
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
