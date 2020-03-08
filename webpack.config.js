const childProcess = require('child_process')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const {version} = require('./package.json')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const webpack = require('webpack')

/** @return {webpack.Configuration} */
module.exports = (_, argv) => {
  // Obtain the date and Git hash to build once per invocation.
  const [date, hash] =
    argv.mode === 'production'
      ? childProcess
          .execSync('git -P log -1 --date=format:%F --format=%ad,%h')
          .toString()
          .trim()
          .split(',')
      : ['0000-01-01', '0dd01d']

  return {
    stats: 'errors-warnings',
    devServer: {
      clientLogLevel: 'warning',
      overlay: {warnings: true, errors: true},
      stats: 'errors-warnings'
    },
    output: {filename: 'index.js'},
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          // Delete the contents but not the directories so that watching
          // doesn't break.
          path.resolve(__dirname, 'dist/**/*'),
          path.resolve(__dirname, 'pkg/**/*')
        ]
      }),
      new CopyPlugin([
        {context: 'src', from: '{**/*.{css,html,png},manifest.json}'}
      ]),
      new webpack.DefinePlugin({
        'process.env': {
          dev: JSON.stringify(argv.mode !== 'production'),
          version: JSON.stringify(version),
          date: JSON.stringify(date),
          hash: JSON.stringify(hash)
        }
      }),
      new WasmPackPlugin({crateDirectory: __dirname, args: '--log-level warn'})
    ],
    performance: {maxAssetSize: 512 * 1024, maxEntrypointSize: 512 * 1024}
  }
}
