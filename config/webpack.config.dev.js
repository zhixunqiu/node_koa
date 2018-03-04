// "use strict";
const webpack = require('webpack');
const path = require('path')

// html 生成
const HtmlWebpackPlugin = require('html-webpack-plugin')

// css自动填充
let autoprefixer = require('autoprefixer');
let precss = require('precss')

// 告别无聊的输出
var DashboardPlugin = require('webpack-dashboard/plugin');

// 多核并行构建
var os = require('os')
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// 公共模块加载
let  { moduleWebpack, resolveWebpack,  devServerWebpack } = require('./webpack.config.common.js')

// 返回到当前工程目录
__dirname = path.resolve(__dirname, '..')

module.exports = {
  devtool: 'source-map',
  cache: true,
  context: path.resolve(__dirname, "src"),
  entry: {
    'main': './index',
  },
  output: {
    filename: 'dist/[name].[hash].js',
    chunkFilename: "dist/[id].[name].[hash].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: moduleWebpack,
  resolve: resolveWebpack,
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [precss, autoprefixer];
        }
      }
    }),
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function(module){
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    // 并行构建
    new HappyPack({
      id: 'babelloader',
      loaders: ['babel-loader?cacheDirectory=true'],
    }),
    new HtmlWebpackPlugin({
      title: '滴滴企业版',
      template: './indexDevelop.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],
  devServer: devServerWebpack
}
