const webpack = require("webpack")
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  plugins: [
    // ビルド時に以前のファイルが残らないように出力先を削除する
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
    new webpack.DefinePlugin({
      // jsonの設定ファイルを読み込んで環境変数にセットする
      ERP_CONFIG: JSON.stringify(require(path.resolve(__dirname, 'config/base.json'))),
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            // babel-loaderがecmascript5に変換する
            loader: 'babel-loader',
            options: {
              presets: [
                // env を指定することで、ES2018 を ES5 に変換。
                // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
                // webpack の Tree Shaking 機能が使えない
                ['env', { 'modules': false }],
                // 'es2015'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      }
    ]
  },
  stats: {
    colors: true
  }
};
