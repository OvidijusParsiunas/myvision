module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: './bundle.js',
  },
  externals: {
    fabric: 'fabric',
    cocoSsd: 'cocoSsd',
  },
  watch: true,
  mode: 'development',
};
