module.exports = [{
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
  watch: true,
  mode: 'development',
}, {
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
  watch: true,
  mode: 'development',
}];
