const path = require('path')

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@fictjs/babel-preset'],
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname),
    },
    devMiddleware: {
      publicPath: '/dist/',
    },
    port: 3000,
    hot: true,
    client: {
      logging: 'warn',
    },
  },
  devtool: false,
}
