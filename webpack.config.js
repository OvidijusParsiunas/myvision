const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

module.exports = () => {
  let plugins = [];
  if (env === 'development' || env === 'production') {
    plugins = [
      new FailOnErrorsPlugin({
        failOnErrors: true,
        failOnWarnings: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Caching',
        template: 'src/indexTemplate.html',
      }),
    ];
  }
  return {
    entry: {
      browserSupportBundle: './browserSupport/index.js',
      mainAppBundle: './src/js/index.js',
    },
    output: {
      filename: 'dist/[name].[contenthash].js',
      path: __dirname,
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
