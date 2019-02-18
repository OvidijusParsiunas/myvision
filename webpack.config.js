module.exports = {
  entry: './index.js',
  output: {
    filename: './bundle.js'
  },
  externals: {
   fabric: 'fabric'
 },
 watch: true
};
