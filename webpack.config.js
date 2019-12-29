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
    devServer: {clientLogLevel: 'warning', stats: 'errors-warnings'},
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          // Delete the contents but not the directories so that watching
          // doesn't break.
          path.resolve(__dirname, 'dist/**/*'),
          path.resolve(__dirname, 'pkg/**/*')
        ]
      }),
      new CopyPlugin([{context: 'src', from: 'assets'}]),
      new webpack.DefinePlugin({
        'process.env': {
          date: JSON.stringify(date),
          version: JSON.stringify(version),
          hash: JSON.stringify(hash)
        }
      }),
      new WasmPackPlugin({
        crateDirectory: __dirname,
        extraArgs: '--out-name index'
      })
    ]
  }
}
