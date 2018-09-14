const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const metadata = require("./metadata.json");

const replaceConfig = Object.keys(metadata).map(function(key) {
  return { search: key, replace: metadata[key], flags: "g" };
});

const config = {
  mode: "development", // 'production',
  context: path.resolve(__dirname, "."),
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    // publicPath: "dist/",
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".less", ".css", ".js", ".json", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2017", "react", "stage-0"],
            },
          },
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              prefix: "font",
              mimetype: "application/font-woff",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "application/octet-stream",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/svg+xml",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.ya?ml$/,
        use: ["json-loader", "yaml-loader"],
      },
      {
        test: /\.(html|js|yml)$/,
        use: [
          {
            loader: "string-replace-loader",
            query: { multiple: replaceConfig },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        worker: {
          output: {
            filename: "[id].[hash].worker.js",
            chunkFilename: "[id].[hash].worker.js",
          },
        },
      },
    }),
  ],
};

module.exports = config;
