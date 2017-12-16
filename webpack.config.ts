import * as path from 'path'
import * as CleanPlugin from 'clean-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
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
    new CopyWebpackPlugin([
      {from: 'src/index.html'},
      {from: 'src/assets', to: 'assets'}
    ])
  ]
}

export default config
