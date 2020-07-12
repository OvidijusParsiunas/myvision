const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

module.exports = () => {
  const bundlesDirectoryName = env === 'production' ? 'dist' : 'devBundles';
  const fabricjsFileExtension = env === 'production' ? '.min.js' : '.js';
  let plugins = [];
  if (env === 'development' || env === 'production') {
    plugins = [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [`./${bundlesDirectoryName}/*`],
      }),
      new FailOnErrorsPlugin({
        failOnErrors: true,
        failOnWarnings: true,
      }),
      new HtmlWebpackPlugin({
        fabricjsFileExtension,
        template: 'src/indexTemplate.html',
        minify: false,
      }),
    ];
  }
  return {
    entry: {
      browserSupportBundle: './src/browserSupport/index.js',
      appBundle: './src/app/index.js',
    },
    output: {
      filename: `${bundlesDirectoryName}/[name].[contenthash].js`,
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
