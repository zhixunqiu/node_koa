const path = require('path');
const webpack = require('webpack');

// 可视化构建
var Visualizer = require('webpack-visualizer-plugin');

// 引用公共配置
let  { moduleWebpack, resolveWebpack } = require('./webpack.config.common.js')

// 自动插入html
const AssetsPlugin = require('assets-webpack-plugin');

__dirname = path.resolve(__dirname, '..')

// 多核压缩构建
var os = require('os')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// 多核并行构建
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  devtool: 'source-map',
  entry: {
    vendor: [
        './src/components',
        // 'jimu-bridge',
        // 'babel-polyfill',
        // 'redux',
        // 'react-redux',
        // 'react-router',
        // 'react-router-redux',
        // 'redux-router'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist/a/dist_a'),
    filename: '[name].[chunkhash].js',
    library: '[name]_[chunkhash]',
    publicPath: '/dist_a/'
  },
  module: moduleWebpack,
  resolve: resolveWebpack,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify("production"), //react切换到produco版本
      }
    }),
    // 并行压缩
    new UglifyJSPlugin({
      sourceMap: true,
      output: {
          comments: false,
          beautify: false
      }
    }),
    // 并行构建
    new HappyPack({
      id: 'babelloader',
      loaders: ['babel-loader?cacheDirectory=true'],
    }),
    // dll 生成
    new webpack.DllPlugin({
      path: path.join(__dirname, 'log', '[name]-manifest.json'),
      name: '[name]_[chunkhash]'
    }),
    new AssetsPlugin({
      filename: 'assetsplugin.json',
      path: path.join(__dirname, 'log'),
    }),
    // 项目依赖图
    new Visualizer({
      filename: '../../../log/statistics-vendor.html'
    }),
  ]
};
