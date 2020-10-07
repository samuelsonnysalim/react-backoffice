require("dotenv").config();

const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const withSass = require("@zeit/next-sass");
const withCss = require("@zeit/next-css");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
  withSass(
    withCss({
      distDir: ".next",
      crossOrigin: "anonymous",
      poweredByHeader: false,
      webpack(config, { isServer }) {
        config.resolve.plugins = config.resolve.plugins || [];
        config.plugins = config.plugins || [];
        config.externals = config.externals || {};

        config.resolve.plugins.push(new TsconfigPathsPlugin({ configFile: "tsconfig.json" }));
        config.plugins.push(
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
          new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
          }),
          new Dotenv({
            path: path.join(__dirname, ".env"),
            systemvars: true,
          }),
        );
        // config.externals.jquery = "$";
        config.module.rules.push({
          test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "raw-loader",
        });
        if (config.mode === "production") {
          if (Array.isArray(config.optimization.minimizer)) {
            config.optimization.minimizer.push(
              new OptimizeCSSAssetsPlugin({
                cssProcessor: require("css-mqpacker"),
              }),
            );
            config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
          }
        }

        if (!isServer) {
          config.node = {
            fs: "empty",
          };
        }
        return config;
      },
    }),
  ),
);
