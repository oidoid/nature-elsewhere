import * as CleanPlugin from 'clean-webpack-plugin'
import * as CopyPlugin from 'copy-webpack-plugin'
import * as webpack from 'webpack'

const stats = {all: false, errors: true, warnings: true}

const config: webpack.Configuration = {
  resolve: {extensions: ['.ts', '.js']},

  output: {filename: 'index.js'},

  module: {
    rules: [
      {test: /\.ts$/, loader: 'ts-loader'},
      {test: /\.(frag|vert)$/, loader: 'raw-loader'},
      {
        test: /\.(png)$/,
        loader: 'file-loader',
        options: {name: '[path][name].[ext]', context: 'src'}
      }
    ]
  },

  stats,

  devServer:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          clientLogLevel: 'warning',
          progress: false,
          overlay: {warnings: true, errors: true},
          stats
        },

  plugins: [
    new CleanPlugin('dist', {verbose: false}),
    new CopyPlugin([{context: 'src', from: '**/*.html'}])
  ]
}

export default config
