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
  new AssetsPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
];

let entries: any = {
  shared: ["./client/src/shared.ts"],
  users: ["./client/src/users.ts"]
}

export = (env: any) => {
  let cssName = "[name].css";
  let jsName = "[name].js";
  let cssLoader : string[] | webpack.Loader[] = 
    ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [ "css-loader" ],
        publicPath: "/"
    });
  
  if (env && env.production) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    cssName = "[chunkhash].[name].css";
    jsName = "[chunkhash].[name].js";
  }

  if (env.hot) {
    cssLoader = [ "style-loader", "css-loader" ];
    plugins.push(new webpack.HotModuleReplacementPlugin());

    Object.keys(entries).forEach(entryKey => {
      entries[entryKey].push("webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000");
    });
  }

  plugins.push(new ExtractTextPlugin("stylesheets/" + cssName));

  return {
    entry: entries,
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
          use: cssLoader,
          exclude: /node_modules/ 
        }
      ],
      noParse: [/\.elm$/]
    },
    plugins: plugins,
    output: {
      filename: "javascripts/" + jsName,
      path: path.resolve(__dirname, "public"),
      publicPath: "/"
    },
  }
}
