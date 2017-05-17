module.exports = {
  entry: './src/index',
  output: {
    filename: './dist/bundle.js'
    //path: __dirname + '/dist/'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};