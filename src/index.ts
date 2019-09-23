import {AssetLoader} from './loaders/AssetLoader'
import {Game} from './Game'
import {Settings} from './settings/Settings'
;(async () => {
  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing.')

  const assets = await AssetLoader.load()
  const game = Game.make(window, canvas, assets, Settings.defaults)
  Game.start(game)
})()
