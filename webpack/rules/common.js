const { src } = require("../webpack.paths");

module.exports = [
  {
    test: /\.(css|less)$/,
    include: src,
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
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: "babel-loader",
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
    test: /\.ya?ml$/,
    use: ["json-loader", "yaml-loader"],
  },
];