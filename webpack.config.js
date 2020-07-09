const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');

const env = process.env.NODE_ENV || 'production';

module.exports = () => {
  let plugins = [];
  if (env === 'development' || env === 'production') {
    plugins = [
      new FailOnErrorsPlugin({
        failOnErrors: true,
        failOnWarnings: true,
      })];
  }
  return [
    {
      entry: './browserSupport/index.js',
      output: {
        filename: './browserSupportBundle22.js',
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
    },
    {
      entry: './src/js/index.js',
      output: {
        filename: './appBundle22.js',
      },
      externals: {
        fabric: 'fabric',
      },
      module: {
        // comment out the following to not display warnings/errors in console when developing
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
    }];
};
