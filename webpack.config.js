import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: '商品选购',
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 8088,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
        },
      },
    },
  },
  performance: {
    maxAssetSize: 1024 * 1024,
    maxEntrypointSize: 1024 * 1024,
    hints: 'warning',
  },
};
