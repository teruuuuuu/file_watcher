const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    'index': './src/app/index.js',
    // 'scala': '../scala/target/scala-2.13/scala-fastopt.js',
    'sample': './src/sample.js',
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: "[name]-bundle.js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['index'],
      filename: 'index.html',
      template: "./html/index.html"
    }),
    new HtmlWebpackPlugin({
      chunks: ['sample'],
      filename: 'sample.html',
      template: "./html/sample.html"
    }),
  ],
  module: {
    rules: [
      {
        test: /\.less$/,
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
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      // {
      //   enforce: 'pre',
      //   include: [path.resolve(__dirname, "src")],
      //   exclude: /node_modules/,
      //   test: /\.js$/,
      //   loader: "eslint-loader",
      // },
      {
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ]
  },
  stats: {
    colors: true
  }
};
