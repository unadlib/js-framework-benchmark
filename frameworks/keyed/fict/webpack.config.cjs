const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/main.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@fictjs/babel-preset",
                {
                  dev: false,
                  // Benchmark fixture intentionally uses snapshot-style helpers;
                  // avoid fail-closed strict guarantee diagnostics in perf builds.
                  strictGuarantee: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: "false",
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname),
    },
    devMiddleware: {
      publicPath: "/dist/",
    },
    port: 3000,
    hot: true,
    client: {
      logging: "warn",
    },
  },
  devtool: false,
};
