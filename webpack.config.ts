import * as childProcess from 'child_process'
import * as CleanPlugin from 'clean-webpack-plugin'
import * as CopyPlugin from 'copy-webpack-plugin'
import * as pkg from './package.json'
import * as webpack from 'webpack'

const stats: Readonly<webpack.Stats.ToJsonOptionsObject> = Object.freeze({
  all: false,
  errors: true,
  warnings: true
})
const [date, hash]: ReadonlyArray<string> = Object.freeze(
  childProcess
    .execSync('git --no-pager log -1 --date=format:%F --pretty=%ad,%h')
    .toString()
    .trim()
    .split(',')
)

// Webpack will modify this export. Object.freeze() produces a warning: "...The
// 'mode' option has not been set..."
const config: webpack.Configuration = {
  entry: [
    `webpack-dev-server/client?http://localhost:8080`,
    'webpack/hot/only-dev-server',
    './src/index.ts'
  ],
  stats,

  resolve: {extensions: ['.js', '.ts']},

  output: {filename: 'index.js'},

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{loader: 'ts-loader', options: {transpileOnly: true}}]
      },
      {test: /\.(frag|vert)$/, use: 'raw-loader'}
    ]
  },

  plugins: [
    new CleanPlugin('dist', {verbose: false}),
    new CopyPlugin([
      {context: 'src', from: '**/*.{css,html,ico,png,svg,xml}'},
      {context: 'src', from: 'manifest.json'}
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        date: JSON.stringify(date),
        version: JSON.stringify(pkg.version),
        hash: JSON.stringify(hash)
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    hotOnly: true,
    clientLogLevel: 'warning',
    overlay: {warnings: true, errors: true},
    stats
  },

  // Polyfill filenames.
  node: {
    __dirname: true,
    __filename: true
  }
}

export default config
