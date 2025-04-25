/* 配置vue开发环境的webpack配置，处理各种文件（js啊、css啊、html啊...） */
'use strict'
var webpack = require('webpack')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  // mode:'development',//指定开发者模式，不会压缩和混淆代码节约时间；production产品发布模式，会压缩和混淆代码，转换时间长
  // context: path.resolve(__dirname,'../'),
  
  entry: {
    app: './src/main.js'
  },
  // externals:{//baidumap
  //   'BMap':'BMap',
  //   'BMap_Symbol_SHAPE_POINT':'BMap_Symbol_SHAPE_POINT'
  // },
  output: {
    // path: config.build.assetsRoot,
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    publicPath: process.env.NODE_ENV === 'development'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], // import时可以省略这些文件的后缀
    alias: {
      'vue$': 'vue/dist/vue.esm.js', // 默认从哪里找vue
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        // include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
        exclude: /node_modules/
      },
      // 转为es5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      // 图片处理
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      // less文件处理
      // 多个loader的调用顺序是从右往左调用的
      {
        test: /\.less$/, // test表示要匹配的文件类型
        use: [{ // use表示对应要调用的loader
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'

  },
  plugins: [ 
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery" 
    }) 
  ]
  // "externals": {
  //   "vue":"Vue",
  //   "echarts": "echarts",
  //   "element-ui":"element-ui",
  //   "uuid":"uuid"
  // }
}
