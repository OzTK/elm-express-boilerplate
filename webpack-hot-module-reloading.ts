import HotModuleReloading from "./contract/hot-module-reloading";
import * as config from "config";

import * as express from "express";
import * as webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import { injectable } from "inversify";

@injectable()
export default class WebpackHotModuleReloading implements HotModuleReloading {
  setup(app: express.Application): void {
    const wpConfig = require("./webpack.config.js")(config.get("env"));
    const compiler = webpack(wpConfig);
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: wpConfig.output.publicPath,
        stats: { colors: true },
      }),
    );
    app.use(
      webpackHotMiddleware(compiler, {
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000,
      }),
    );
  }
}
