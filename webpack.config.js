var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  if (!env) {
    env = {};
  }

  let cssName = '[name].css';
  let jsName = '[name].js';

  if (env.production) {
    cssName = '[chunkhash].[name].css';
    jsName = '[chunkhash].[name].js';
  }

  return {
    entry: (() => {
      let entries = {
        users: ['./client/users.ts'],
        home: ['./client/home.ts'],
        error: ['./client/error.ts'],
      };

      if (env.hot) {
        Object.keys(entries).forEach(entryKey => {
          const path = entries[entryKey][0];
          // We are in dist/ but want to get the changes
          // from our original source files -> going up 1 level
          entries[entryKey][0] = "." + path;
          entries[entryKey].push(
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
          );
        });
      }

      return entries;
    })(),
    resolve: {
      extensions: ['.ts', '.js', '.elm'],
    },
    module: (() => {
      // Mapping each page's css to a rule (required for elm-css-webpack-loader)
      const cssRules = [
        'HomeStylesheets',
        'UsersStylesheets',
        'MainStylesheets',
      ].map((moduleName) => ({
        test: new RegExp(moduleName + '.elm$'),
        use: env.hot
          ? [
              'style-loader',
              'css-loader',
              'elm-css-webpack-loader?module=' + moduleName,
            ]
          : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader',
                'elm-css-webpack-loader?module=' + moduleName,
              ],
              publicPath: '/',
            }),
        exclude: [/elm-stuff/, /node_modules/],
      }));

      return {
        rules: [
          {
            test: /\.elm$/,
            exclude: [/elm-stuff/, /node_modules/, /Stylesheets\.elm$/],
            use: [
              'elm-hot-loader',
              'elm-webpack-loader?verbose=true&warn=true',
            ],
          },
          { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
          {
            test: /\.css$/,
            use: env.hot
              ? ['style-loader', 'css-loader']
              : ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: ['css-loader'],
                  publicPath: '/',
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
          names: ['manifest'], // Specify the common bundle's name.
        }),
        new CleanWebpackPlugin(
          ['javascripts', 'stylesheets', '../webpack-assets.json'],
          {
            root: path.resolve(__dirname, 'public'),
            verbose: !env.production,
          },
        ),
        new AssetsPlugin({ path: env.hot ? __dirname : path.join(__dirname, 'dist') }),
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
            'stylesheets/' +
              (!env.production ? '[name].css' : '[chunkhash].[name].css'),
          ),
        );
      }

      return plugins;
    })(),
    output: {
      // chunkhash not supported with HMR
      filename:
        'javascripts/' +
        (!env.production ? '[name].js' : '[chunkhash].[name].js'),
      path: env.hot ? path.resolve(__dirname, 'public') : path.resolve(__dirname, 'dist', 'public'),
      publicPath: '/',
    },
  };
};
