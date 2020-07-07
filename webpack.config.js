const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

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
        filename: './browserSupportBundle.js',
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
        filename: './appBundle.js',
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
    }];
};
