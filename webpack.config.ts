import * as childProcess from 'child_process'
import * as CleanPlugin from 'clean-webpack-plugin'
import * as CopyPlugin from 'copy-webpack-plugin'
import * as pkg from './package.json'
import * as webpack from 'webpack'

const stats = {all: false, errors: true, warnings: true}
const [date, hash]: string[] = childProcess
  .execSync('git --no-pager log -1 --date=format:%F --pretty=%ad,%h')
  .toString()
  .trim()
  .split(',')

const config: webpack.Configuration = {
  stats,

  resolve: {extensions: ['.js', '.ts']},

  output: {filename: 'index.js'},

  module: {
    rules: [
      {test: /\.ts$/, use: 'ts-loader'},
      {test: /\.(frag|vert)$/, use: 'raw-loader'}
    ]
  },

  plugins: [
    new CleanPlugin('dist', {verbose: false}),
    new CopyPlugin([{context: 'src', from: '**/*.{html,png}'}]),
    new webpack.DefinePlugin({
      'process.env': {
        date: JSON.stringify(date),
        version: JSON.stringify(pkg.version),
        hash: JSON.stringify(hash)
      }
    })
  ],

  devServer: {
    clientLogLevel: 'warning',
    overlay: {warnings: true, errors: true},
    stats
  }
}

export default config
