import * as CleanPlugin from 'clean-webpack-plugin'
import * as CopyPlugin from 'copy-webpack-plugin'
import * as webpack from 'webpack'

const stats = {all: false, errors: true, warnings: true}

const config: webpack.Configuration = {
  stats,

  resolve: {extensions: ['.ts', '.js']},

  output: {filename: 'index.js'},

  module: {
    rules: [
      {test: /\.ts$/, use: 'ts-loader'},
      {test: /\.(frag|vert)$/, use: 'raw-loader'}
    ]
  },

  plugins: [
    new CleanPlugin('dist', {verbose: false}),
    new CopyPlugin([{context: 'src', from: '**/*.{html,png}'}])
  ],

  devServer: {
    clientLogLevel: 'warning',
    overlay: {warnings: true, errors: true},
    stats
  }
}

export default config
