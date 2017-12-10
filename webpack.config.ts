import * as path from "path";
import * as CleanPlugin from "clean-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as webpack from "webpack";

const config: webpack.Configuration = {
  entry: "./src",
  resolve: { extensions: [".ts", ".js"] },

  output: { path: path.resolve("build"), filename: "index.js" },

  module: {
    rules: [
      { test: /\.png$/, use: "url-loader" },
      { test: /\.ts$/, use: "ts-loader" }
    ]
  },

  plugins: [
    new CleanPlugin("build"),
    new CopyWebpackPlugin([{ from: "src/index.html" }])
  ]
};

export default config;
