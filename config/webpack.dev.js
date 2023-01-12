const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const pages = ["index", "legal", "privacy-policy", "terms", "disclaimer", "imprint"];
module.exports = {
  entry: pages.reduce((config, page) => {
    config[page] = `./src/scripts/pages/${page}.js`;
    return config;
  }, {}),
  output: {
    path: path.join(__dirname, "../build"),
    filename: "[name].js",
    publicPath: "/"
  },
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "../build"),
    compress: true,
    port: 3200,
    overlay: true,
    disableHostCheck: true,   // That solved it
  },
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // transpiling our JavaScript files using Babel and webpack
        },
      },
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader', 'postcss-loader'],
      // },
      {
        test: /\.(sc|sa|c)ss$/i,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "postcss-loader", // Loader for webpack to process CSS with PostCSS
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif|ico)$/,
        use: [
          {
            loader: "file-loader", // This will resolves import/require() on a file into a url and emits the file into the output directory.
            options: {
              name: "[name].[ext]",
              outputPath: "assets/",
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            attrs: ["img:src", ":data-src"],
            minimize: true,
          },
        },
      },
    ],
  },
  plugins: [
    // CleanWebpackPlugin will do some clean up/remove folder before build
    // In this case, this plugin will remove 'dist' and 'build' folder before re-build again
    new CleanWebpackPlugin(),
    // The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/${page}.html`,
          filename: page === "index" ? `${page}.html` : page === "privacy-policy" ? `privacy/policy/index.html` : `${page}/index.html`,
          chunks: [page],
        })
    ),
    new CopyPlugin({
      patterns: [
        { from: "./src/images/favicon.ico", to: "assets/favicon.ico" },
        {
          from: "./src/images/twitter-card.png",
          to: "assets/twitter-card.png",
        },
        { from: "./src/images/ash-logo.png", to: "assets/ash-logo.png" },
        { from: "./src/images/ash-logo.svg", to: "assets/ash-logo.svg" },
        { from: "./src/files/terms-of-sale.pdf", to: "files/terms-of-sale.pdf" },
      ],
    }),
  ],
};
