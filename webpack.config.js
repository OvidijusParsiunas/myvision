module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: './bundle.js',
  },
  externals: {
    fabric: 'fabric',
  },
  watch: true,
  mode: 'development',
};
