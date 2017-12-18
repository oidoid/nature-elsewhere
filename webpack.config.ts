import * as path from 'path'
import * as CleanPlugin from 'clean-webpack-plugin'
import * as CopyPlugin from 'copy-webpack-plugin'
import ShellPlugin = require('webpack-shell-plugin')
import * as webpack from 'webpack'

const PRODUCTION = process.env.NODE_ENV === 'production'

const STATS = {
  all: false,
  colors: true,
  errors: true,
  errorDetails: true,
  moduleTrace: true,
  warnings: true
}

function tiledCmd(asset: string) {
  return `tiled --export-map json src/${asset}.tmx build/${asset}.json`
}

const config: webpack.Configuration = {
  entry: './src',
  resolve: {extensions: ['.ts', '.js']},

  output: {path: path.resolve('build'), filename: 'index.js'},

  module: {rules: [{test: /\.ts$/, use: 'ts-loader'}]},

  stats: STATS,

  devServer: PRODUCTION
    ? undefined
    : {
        clientLogLevel: 'warning',
        progress: false,
        noInfo: true,
        overlay: {warnings: true, errors: true},
        stats: STATS
      },

  plugins: [
    new CleanPlugin('build', {verbose: false}),
    new CopyPlugin([
      {from: 'src/index.html'},
      {from: 'src/assets', to: 'assets'}
    ]),

    // This is a complete hack since it runs unconditionally and requires the
    // build directory to exist even when watching.
    new ShellPlugin({
      dev: false,
      onBuildStart: ['mkdir -p build/assets/maps', tiledCmd('assets/maps/pond')]
    })
  ]
}

export default config
