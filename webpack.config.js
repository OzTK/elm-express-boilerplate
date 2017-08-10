var path = require("path");
var webpack = require("webpack");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var AssetsPlugin = require("assets-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (env) => {
  if (!env) {
    env = {};
  }

  let cssName = "[name].css";
  let jsName = "[name].js";

  if (env.production) {
    cssName = "[chunkhash].[name].css";
    jsName = "[chunkhash].[name].js";
  }

  return {
    entry: (() => {
      let entries = {
        users: ["./client/src/users.ts"],
        home: ["./client/src/home.ts"],
        error: ["./client/src/error.ts"],
      };

      if (env.hot) {
        Object.keys(entries).forEach(entryKey => {
          entries[entryKey].push(
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
          );
        });
      }

      return entries;
    })(),
    resolve: {
      extensions: [".ts", ".js", ".elm"],
    },
    module: (() => {
      // Mapping each page's css to a rule (required for elm-css-webpack-loader)
      const cssRules = [
        "HomeStylesheets",
        "UsersStylesheets",
        "MainStylesheets",
      ].map((moduleName) => ({
        test: new RegExp(moduleName + ".elm$"),
        use: env.hot
          ? [
              "style-loader",
              "css-loader",
              "elm-css-webpack-loader?module=" + moduleName,
            ]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                "css-loader",
                "elm-css-webpack-loader?module=" + moduleName,
              ],
              publicPath: "/",
            }),
        exclude: [/elm-stuff/, /node_modules/],
      }));

      return {
        rules: [
          {
            test: /\.elm$/,
            exclude: [/elm-stuff/, /node_modules/, /Stylesheets\.elm$/],
            use: [
              "elm-hot-loader",
              "elm-webpack-loader?verbose=true&warn=true",
            ],
          },
          { test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ },
          {
            test: /\.css$/,
            use: env.hot
              ? ["style-loader", "css-loader"]
              : ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: ["css-loader"],
                  publicPath: "/",
                }),
            exclude: /node_modules/,
          },
        ].concat(cssRules),
        noParse: [/^((?!styles).)*\.elm.*$/],
      };
    })(),
    plugins: (() => {
      let plugins = [
        new webpack.optimize.CommonsChunkPlugin({
          names: ["manifest"], // Specify the common bundle's name.
        }),
        new CleanWebpackPlugin(
          ["javascripts", "stylesheets", "../webpack-assets.json"],
          {
            root: path.resolve(__dirname, "public"),
            verbose: true,
          },
        ),
        new AssetsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
      ];

      if (env.production) {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
      }

      if (env.hot) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
      } else {
        // chunkhash not supported with HMR
        plugins.push(
          new ExtractTextPlugin(
            "stylesheets/" +
              (!env.production ? "[name].css" : "[chunkhash].[name].css"),
          ),
        );
      }

      return plugins;
    })(),
    output: {
      // chunkhash not supported with HMR
      filename:
        "javascripts/" +
        (!env.production ? "[name].js" : "[chunkhash].[name].js"),
      path: path.resolve(__dirname, "public"),
      publicPath: "/",
    },
  };
};
