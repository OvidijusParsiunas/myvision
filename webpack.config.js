const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = () => {
  const outputFileName = env === 'production' ? '[name].[contenthash].js' : '[name].js';
  const externalsFileExtension = env === 'production' ? '.min.js' : '.js';
  const plugins = [
    new FailOnErrorsPlugin({
      failOnErrors: true,
      failOnWarnings: true,
    }),
    new HtmlWebpackPlugin({
      externalsFileExtension,
      template: 'src/devIndexTemplate.html',
      minify: false,
    })];
  if (env === 'production') {
    plugins.push(new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./public/*'],
    }));
  }
  return {
    entry: {
      browserSupportBundle: './src/browserSupport/index.js',
      appBundle: './src/app/index.js',
    },
    output: {
      filename: outputFileName,
      path: path.resolve(__dirname, './public'),
    },
    externals: {
      fabric: 'fabric',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
            {
              loader: 'eslint-loader',
            },
          ],
        },
      ],
    },
    mode: env,
    plugins,
    performance: {
      maxEntrypointSize: 340000,
      maxAssetSize: 340000,
    },
  };
};