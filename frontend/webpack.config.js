const { profile } = require('console');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    circuit: './frontend/src/circuit_entry.js', 
    lesson: './frontend/src/lesson_entry.js',
    main: './frontend/src/main_entry.js',
    profile: './frontend/src/profile_entry.js',
    },
  output: {
    path: path.resolve(__dirname, '../src/static/js'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
