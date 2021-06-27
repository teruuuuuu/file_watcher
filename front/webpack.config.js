const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    app: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        enforce: "pre",
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
                plugins: [
                  // new CleanCSSPlugin({ advanced: true }),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|gif|png|ico|ttf|otf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "[name].bundle.js",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new webpack.DefinePlugin({
      // jsonの設定ファイルを読み込んで環境変数にセットする
      ENV: JSON.stringify(
        require(path.resolve(__dirname, "./env/default.json"))
      ),
    }),
  ],
  devServer: {
    open: true,
    contentBase: "./dist",
    hot: true,
    port: 8000,
  },
};
