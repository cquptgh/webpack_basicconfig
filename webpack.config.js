const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: ['style-loader','css-loader']
      },
      {
        //打包less资源
        test: /\.less$/,
        use: [
          'style-loader',
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {        //npm i webpack-dev-server -D;  运行命令: npx webpack-dev-server
    contentBase: resolve(__dirname, 'build'),      //项目构建后的路径
    compress: true,             //启动gzip压缩
    port: 3000,
    open: true        //自动打开浏览器
  },
  mode: 'development'
}