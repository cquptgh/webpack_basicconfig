const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname,'build')
  },
  module: {
    rules: [
      {
        //打包样式资源
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',           //css兼容性处理 postcss,postcss-loader,postcss-preset-env
            options: {
              postcssOptions: {
                plugins: [                        //配合package.json中browserslist使用
                  [
                    require('postcss-preset-env')()
                  ]
                ]
              }
            }
          }
        ]
      },
      {
        //打包less资源
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        //打包css样式中的图片资源,url-loader依赖file-loader
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,    //图片大小小于8kb,就会被base64处理
          name: '[hash:10].[ext]',
          outputPath: 'images',  //输出到那个文件夹下
          esModule: false     //为了处理img标签中的图片资源,因为html-loader使用的是CommonJS规范
        }
      },
      {
        //处理img标签中的图片资源
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        //打包其他资源
        exclude: /\.(css|js|html|less)$/,
        loader: 'file-loader'
      },
      {
        //js语法检查:npm i eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import -D
        //配合package.json中eslintConfig配置一起使用
        test: /\.js$/,
        loader: 'eslint-loader',
        options: {
          fix: true     //自动修复eslint错误
        }
      },
      {
        //js兼容性处理: babel-loader @babel/core 这两个包是必须的
        //只完成基础的兼容性处理,不包括像promise这样的语法,可以只使用@babel/preset-env
        //如果需要处理高级的js语法,可以选用一下两种方法：
        /* 
          1.@babel/polyfill  下载后只需要引入即可,它会将全部的兼容性处理都导入,不推荐使用
          2.core-js  按需加载,推荐使用
        */
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: { version: 3 },
                targets: {
                  chrome: '60',
                  firefox: '60'
                }
              }
            ]
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({       //打包html资源
      template: './src/index.html',
      minify: {       //压缩html
        collapseWhitespace: true,     //移除空格
        removeComments: true          //移除注释
      }
    }),
    new MiniCssExtractPlugin({        //提取css为单独文件
      filename: 'css/built.css'
    }),
    new OptimizeCssAssetsWebpackPlugin()      //压缩css资源
  ],
  mode: 'production'
}