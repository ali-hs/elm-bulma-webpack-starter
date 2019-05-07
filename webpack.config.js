const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractAppCss = new ExtractTextPlugin(".");

module.exports = (env, argv) => {
  // console.log("env:", env, process.env);
  // console.log("argv.mode:", argv.mode);
  return {
    entry: "./js/app.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "app.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              babelrc: false
            }
          }
        },
        {
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: [
            { loader: "elm-hot-webpack-loader" },
            {
              loader: "elm-webpack-loader",
              options: {
                cwd: path.resolve(__dirname, "elm"),
                pathToElm: path.resolve(__dirname, "node_modules/.bin/elm"),
                debug: argv.mode === "development",
                verbose: argv.mode === "development",
                optimize: argv.mode !== "development"
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "sass-loader"]
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin("css/app_styles.css"),
      new HtmlWebpackPlugin({
        title: "Webpack Demo",
        meta: { viewport: "width=device-width, initial-scale=1" }
      }),
      new CopyWebpackPlugin([{ from: "static/", to: "dist/" }])
      // new CompressionPlugin({ test: /(\.js|\.css)$/ })
    ],

    optimization: {
      minimizer: [
        new UglifyPlugin({
          uglifyOptions: {
            compress: {
              pure_funcs: [
                "F2",
                "F3",
                "F4",
                "F5",
                "F6",
                "F7",
                "F8",
                "F9",
                "A2",
                "A3",
                "A4",
                "A5",
                "A6",
                "A7",
                "A8",
                "A9"
              ],
              pure_getters: true,
              keep_fargs: false,
              unsafe_comps: true,
              unsafe: true,
              passes: 2
            },
            mangle: true
          }
        })
      ]
    },
    performance: {
      maxEntrypointSize: 500000,
      maxAssetSize: 300000
    },
    devServer: {
      stats: "errors-only",
      host: process.env.HOST,
      port: process.env.PORT,
      historyApiFallback: true,
      open: true,
      overlay: true
    }
  };
};
