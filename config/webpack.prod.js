const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const glob = require("glob");
const pages = ["index", "legal", "privacy-policy", "terms", "disclaimer", "imprint"];
module.exports = {
  entry: pages.reduce((config, page) => {
    config[page] = `./src/scripts/pages/${page}.js`;
    return config;
  }, {}),
  output: {
    path: path.join(__dirname, "../build"),
    filename: "[name].[chunkhash:8].bundle.js",
    chunkFilename: "[name].[chunkhash:8].chunk.js",
    publicPath: "/"
  },
  mode: "production",
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
          MiniCssExtractPlugin.loader,
          // "style-loader",
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
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          reuseExistingChunk: true,
        },
      },
      // chunks: "all",
    },
    // runtimeChunk: {
    //   name: "runtime",
    // },
  },
  plugins: [
    // CleanWebpackPlugin will do some clean up/remove folder before build
    // In this case, this plugin will remove 'dist' and 'build' folder before re-build again
    new CleanWebpackPlugin(),
    // PurgecssPlugin will remove unused CSS
    new PurgecssPlugin({
      paths: glob.sync(path.resolve(__dirname, "../src/**/*"), { nodir: true }),
    }),
    // This plugin will extract all css to one file
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash:8].bundle.css",
      chunkFilename: "[name].[chunkhash:8].chunk.css",
    }),
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
    // ComppresionPlugin will Prepare compressed versions of assets to serve them with Content-Encoding.
    // In this case we use gzip
    // But, you can also use the newest algorithm like brotli, and it's supperior than gzip
    new CompressionPlugin({
      algorithm: "gzip"
    }),
    // new BrotliPlugin(),
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
        { from: "./src/robots.txt", to: "robots.txt" },
        { from: "./src/sitemap.xml", to: "sitemap.xml" },
      ],
    }),
  ],
};
