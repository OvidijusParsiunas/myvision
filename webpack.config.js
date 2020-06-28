module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: './bundle.js',
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
        loader: 'eslint-loader',
      },
    ],
  },
  watch: true,
  mode: 'development',
};
