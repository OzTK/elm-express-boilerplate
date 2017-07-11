import * as path from "path";
import * as webpack from "webpack";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as AssetsPlugin from "assets-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";

export = (env: any = {}) => {
  let cssName = "[name].css";
  let jsName = "[name].js";
  let cssLoader : string[] | webpack.Loader[];
  
  if (env.production) {
    cssName = "[chunkhash].[name].css";
    jsName = "[chunkhash].[name].js";
  }

  return {
    entry: (() => {
      let entries: any = {
        shared: ["./client/src/shared.ts"],
        users: ["./client/src/users.ts"]
      };

      if (env.hot) {
        Object.keys(entries).forEach(entryKey => {
          entries[entryKey].push("webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000");
        });
      }

      return entries;
    })(),
    resolve: {
      extensions: [".ts", ".js", ".elm"]
    },
    module: {
      rules: [
        { 
          test: /(?!css)\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: ["elm-hot-loader", "elm-webpack-loader?verbose=true&warn=true"]
        },
        { test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ },
        { test: /\.css$/,
          use: (env.hot 
                ? [ "style-loader", "css-loader" ]
                : ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [ "css-loader" ],
                    publicPath: "/"
                  })),
          exclude: /node_modules/ 
        }
      ],
      noParse: [/\.elm$/]
    },
    plugins: (() => {
      let plugins = [
        new webpack.optimize.CommonsChunkPlugin({
          names: ["shared", "manifest"] // Specify the common bundle's name.
        }),
        new CleanWebpackPlugin(["javascripts", "stylesheets", "../webpack-assets.json"], {
          root: path.resolve(__dirname, "public"),
          verbose: true
        }),
        new AssetsPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
      ];

      if (env.production) {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
      }

      if (env.hot) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
      } else {
        // chunkhash not supported with HMR
        plugins.push(new ExtractTextPlugin("stylesheets/" + (env.hot ? "[name].css" : "[chunkhash].[name].css")));
      }

      return plugins;
    })(),
    output: {
        // chunkhash not supported with HMR
      filename: "javascripts/" + (env.hot ? "[name].js" : "[chunkhash].[name].js"),
      path: path.resolve(__dirname, "public"),
      publicPath: "/"
    },
  }
}
