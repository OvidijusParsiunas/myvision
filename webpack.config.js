const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CNAMEWebpackPlugin = require('cname-webpack-plugin');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = () => {
  let plugins = [];
  let config = {};
  if (env === 'production') {
    config = {
      loggingLevel: 'normal',
      outputDirectory: 'public',
      outputFileName: '[name].[contenthash].js',
      externalsFileExtension: '.min.js',
      externalsDirectory: 'externalsProd',
    };
    plugins = plugins.concat([
      new CleanWebpackPlugin(),
      new CNAMEWebpackPlugin({
        domain: 'myvision.ai',
      })]);
  } else {
    config = {
      loggingLevel: { assets: false, modules: false, children: false },
      outputDirectory: 'publicDev',
      outputFileName: '[name].js',
      externalsFileExtension: '.js',
      externalsDirectory: 'externalsDev',
    };
  }
  plugins = plugins.concat([
    new FailOnErrorsPlugin({
      failOnErrors: true,
      failOnWarnings: true,
    }),
    new HtmlWebpackPlugin({
      externalsFileExtension: config.externalsFileExtension,
      template: 'src/devIndexTemplate.html',
      minify: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets/css', to: 'assets/css' },
        { from: './src/assets/images', to: 'assets/images' },
        { from: './src/assets/svg', to: 'assets/svg' },
        { from: `./src/assets/externals/${config.externalsDirectory}`, to: 'assets/externals' },
      ],
    }),
  ]);
  return {
    entry: {
      browserSupportBundle: './src/browserSupport/index.js',
      appBundle: './src/app/index.js',
    },
    output: {
      filename: config.outputFileName,
      path: path.resolve(__dirname, `./${config.outputDirectory}`),
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
    stats: config.loggingLevel,
    plugins,
    performance: {
      maxEntrypointSize: 340000,
      maxAssetSize: 340000,
    },
  };
};
