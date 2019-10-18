import {AssetLoader} from './loaders/AssetLoader'
import {Build} from './utils/Build'
import {Game} from './Game'
import {Settings} from './settings/Settings'
;(async () => {
  console.log(`
┌>°┐
│  │DDOID Nature Elsewhere ${Build.date} v${Build.version} ${Build.hash}
└──┘
`)

  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing.')

  const assets = await AssetLoader.load()
  const game = Game.make(window, canvas, assets, Settings.defaults)
  Game.start(game)
})()
