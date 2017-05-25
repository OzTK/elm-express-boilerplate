import * as path from "path";
import * as webpack from "webpack";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as AssetsPlugin from "assets-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";

let plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: ["shared", "manifest"] // Specify the common bundle's name.
  }),
  new CleanWebpackPlugin(["dist", "build", "javascripts", "stylesheets", "../webpack-assets.json"], {
    root: path.resolve(__dirname, "public"),
    verbose: true
  }),
  new AssetsPlugin()
];

export = (env: any) => {
  let cssName = "[name].css";
  if (env.production) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    cssName = "[chunkhash].[name].css";
  }

  plugins.push(new ExtractTextPlugin("stylesheets/" + cssName));

  return {
    entry: {
      shared: "./client/src/shared.ts",
      users: "./client/src/users.ts"
    },
    output: {
      filename: "javascripts/" + (env.production ? "[chunkhash].[name].js" : "[name].js"),
      path: path.resolve(__dirname, "public")
    },
    resolve: {
      extensions: [".ts", ".js", ".elm"]
    },
    module: {
      rules: [
        { test: /(?!css)\.elm$/, exclude: [/elm-stuff/, /node_modules/], use: "elm-webpack-loader?verbose=true&warn=true" },
        { test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ },
        { test: /\.css$/
          , use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [ "css-loader" ],
              publicPath: "/"
            })
          , exclude: /node_modules/ 
        }
      ],
      noParse: [/\.elm$/]
    },
    plugins: plugins
  }
}
