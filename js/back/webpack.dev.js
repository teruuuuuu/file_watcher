const merge = require('webpack-merge');
const path = require('path');
// baseの設定を読み込む
const common = require('./webpack.base.js');

// baseの設定とマージして使用する
module.exports = merge(common, {
  mode: 'development',
  // ソースマップを出力する
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
});
