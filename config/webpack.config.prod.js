// "use strict";
const webpack = require('webpack');
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 项目依赖图显示
var Visualizer = require('webpack-visualizer-plugin');
let autoprefixer = require('autoprefixer');
let precss = require('precss')

// 多核压缩构建
var os = require('os')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// 多核并行构建
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// 返回到当前工程目录
__dirname = path.resolve(__dirname, '..')

//引用libjs
var bundleConfig = require("../log/assetsplugin.json")

let  { moduleWebpack, resolveWebpack } = require('./webpack.config.common.js')

module.exports = function(env) {
  return {
    cache: true, //开启缓存模式
    devtool: 'source-map',
    entry: {
      main: './src/index'
    },
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: "[id].[name].[chunkhash].js",
        path: path.resolve(__dirname, 'dist/a/dist_a'),
        publicPath: '/dist_a/'
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
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require('../log/vendor-manifest.json')
        }),
        new webpack.DefinePlugin({
          'process.env': {
              'NODE_ENV': JSON.stringify('production')
          }, //react切换到produco版本
        }),
        new HtmlWebpackPlugin({
          title: '滴滴企业版',
          template: './src/index.html',
          filename: '../index.html',
          bundleName: bundleConfig.vendor.js, //追加默认dll
          inject: 'body'
        }),
        // 最小化加载
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        // 并行压缩
        new UglifyJSPlugin({
            ie8: false,
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
        // 项目依赖图
        new Visualizer({
          filename: '../../../log/statistics.html'
        }),
    ]
  }
}
