module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: './bundle.js',
  },
  externals: {
    fabric: 'fabric',
  },
  module: {
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
