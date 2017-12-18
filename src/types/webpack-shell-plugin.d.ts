// todo: delete pending
// https://github.com/1337programming/webpack-shell-plugin/pull/57.
declare namespace WebpackShellPlugin {
  interface Options {
    /** Scripts to execute on the initial build. Defaults to []. */
    onBuildStart?: string[]

    /**
     * Scripts to execute after files are emitted at the end of the
     * compilation. Defaults to [].
     */
    onBuildEnd?: string[]

    /** Scripts to execute after Webpack's process completes. Defaults to []. */
    onBuildExit?: string[]

    /**
     * Switch for development environments. This causes scripts to execute once.
     * Useful for running HMR on webpack-dev-server or webpack watch mode.
     * Defaults to true.
     */
    dev?: boolean

    /**
     * Switches script execution process from spawn to exec. If running into
     * problems with spawn, turn this setting on. Defaults to false.
     */
    safe?: boolean

    /** DEPRECATED. Enable for verbose output. Defaults to false. */
    verbose?: boolean
  }
}

declare module 'webpack-shell-plugin' {
  import * as webpack from 'webpack'

  class Plugin extends webpack.Plugin {
    constructor(options?: WebpackShellPlugin.Options)
  }

  export = Plugin
}
