const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  context: __dirname,
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "dev"),
    publicPath: '/',
    hashDigestLength: 5,
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dev'),
    compress: true,
    historyApiFallback: true,
    stats: 'errors-only',
    port: 8080,
    open: true,
    hot: true,
    clientLogLevel: 'warning'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {importLoaders: 1}
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {importLoaders: 2}
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'img/[name].[hash:5].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'font/[name].[hash:5].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      templateParameters: {
        title: process.env.npm_package_name
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
