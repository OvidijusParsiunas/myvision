const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = () => {
  const loggingLevel = env === 'production' ? 'normal' : { assets: false, modules: false, children: false };
  const outputDirectory = env === 'production' ? 'public' : 'publicDev';
  const outputFileName = env === 'production' ? '[name].[contenthash].js' : '[name].js';
  const externalsFileExtension = env === 'production' ? '.min.js' : '.js';
  const externalsDirectory = env === 'production' ? 'externalsProd' : 'externalsDev';
  const plugins = [
    new FailOnErrorsPlugin({
      failOnErrors: true,
      failOnWarnings: true,
    }),
    new HtmlWebpackPlugin({
      externalsFileExtension,
      template: 'src/devIndexTemplate.html',
      minify: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets/css', to: 'assets/css' },
        { from: './src/assets/images', to: 'assets/images' },
        { from: './src/assets/svg', to: 'assets/svg' },
        { from: `./src/assets/externals/${externalsDirectory}`, to: 'assets/externals' },
      ],
    }),
  ];
  if (env === 'production') {
    plugins.push(new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [`./${outputDirectory}/*`],
    }));
  }
  return {
    entry: {
      browserSupportBundle: './src/browserSupport/index.js',
      appBundle: './src/app/index.js',
    },
    output: {
      filename: outputFileName,
      path: path.resolve(__dirname, `./${outputDirectory}`),
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
    stats: loggingLevel,
    plugins,
    performance: {
      maxEntrypointSize: 340000,
      maxAssetSize: 340000,
    },
  };
};
