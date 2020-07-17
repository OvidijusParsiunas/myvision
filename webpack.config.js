const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

module.exports = () => {
  const bundleDirectory = env === 'production' ? 'dist' : 'devBundles';
  const outputFileName = env === 'production' ? `${bundleDirectory}/[name].[contenthash].js` : `${bundleDirectory}/[name].js`;
  const fabricjsFileExtension = env === 'production' ? '.min.js' : '.js';
  const plugins = [
    new FailOnErrorsPlugin({
      failOnErrors: true,
      failOnWarnings: true,
    }),
    new HtmlWebpackPlugin({
      fabricjsFileExtension,
      template: 'src/indexTemplate.html',
      file: 'index.html',
      minify: false,
    })];
  if (env === 'production') {
    plugins.push(new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [`./${bundleDirectory}/*`],
    }));
  }
  return {
    entry: {
      browserSupportBundle: './src/browserSupport/index.js',
      appBundle: './src/app/index.js',
    },
    output: {
      filename: outputFileName,
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
