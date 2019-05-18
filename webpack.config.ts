import * as childProcess from 'child_process'
import * as CopyPlugin from 'copy-webpack-plugin'
import * as webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'
import {version} from './package.json'

const [date, hash]: readonly string[] = Object.freeze(
  childProcess
    .execSync('git --no-pager log -1 --date=format:%F --pretty=%ad,%h')
    .toString()
    .trim()
    .split(',')
)

export default (): webpack.Configuration => ({
  stats: <any>'errors-warnings',

  resolve: {extensions: ['.js', '.ts']},

  module: {
    rules: [
      {test: /\.ts$/, use: 'ts-loader'},
      {test: /\.(frag|vert)$/, use: 'raw-loader'}
    ]
  },

  plugins: [
    new CleanPlugin(),
    new CopyPlugin([
      {context: 'src', from: '**/*.{css,html,ico,png,svg,xml}'},
      {context: 'src', from: 'manifest.json'}
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        date: JSON.stringify(date),
        version: JSON.stringify(version),
        hash: JSON.stringify(hash)
      }
    })
  ],

  devServer: {
    clientLogLevel: 'warning',
    overlay: {warnings: true, errors: true},
    stats: <any>'errors-warnings'
  }
})
