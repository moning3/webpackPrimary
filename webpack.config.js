var HtmlWebpackPlugin = require('html-webpack-plugin');

// sass/scss处理完成存储与css文件夹
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 清除文件(只保留dist文件)
const CleanWebpackPlugin = require('clean-webpack-plugin')

const webpack = require('webpack');
const path = require('path')

// true为生产环境，false为开发环境
var isProd = process.env.NODE_ENV === 'production'; // true or false
var cssDev = ['style-loader', 'css-loader', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader']
})
var cssConfig = isProd ? cssProd : cssDev;


const bootstrapEntryPoints = require('./webpack.bootstrap.config')
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

let pathsToClean = [
  'dist'
]

module.exports = {
    entry: {
      "app.bundle": './src/app.js',
      // 这行是新增的。
      "contact": './src/contact.js',
      "bootstrap": bootstrapConfig
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js'
      // path: __dirname + '/dist',
      // filename: 'app.bundle.js'
    },
    devServer: {
      // 修改端口号
      port: 9000,
      // 自动打开浏览器
      open: true,
      hot: true
    },
    plugins: [
      new CleanWebpackPlugin(pathsToClean),

      new HtmlWebpackPlugin({
        template: './src/index.html',
        // 更改生成出的index名
        filename: 'index.html',
        // 将内容不必要的空格去掉
        minify: {
          collapseWhitespace: true,
        },
        hash: true,
        // 不包含
        excludeChunks: ['contact']
      }),

      new HtmlWebpackPlugin({
        template: './src/contact.html',
        filename: 'contact.html',
        minify: {
          collapseWhitespace: true,
        },
        hash: true,
        // 包含
        chunks: ['contact']
      }),
      new ExtractTextPlugin({
        filename: 'style.css',
        disable: !isProd
      }),

      // 这两行是新增的
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: cssConfig
        },
        // 处理react相关内容
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        { test: /\.pug$/, loader: ['raw-loader', 'pug-html-loader'] },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'image/'
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use:[
            {
              loader: 'html-loader',
              options: {
                minimize: true
              }
            }
          ]
        }
      ],
      loaders: [
        { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000' },
        { test: /\.(ttf|eot)$/, loader: 'file-loader' },
        { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
      ],
    }
  };