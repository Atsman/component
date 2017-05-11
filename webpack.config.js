const path = require('path');
const base = require('./webpack.base');

module.exports = Object.assign({}, base, {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
});

