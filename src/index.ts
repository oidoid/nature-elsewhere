import {AssetLoader} from './loaders/asset-loader'
import {Game} from './game'
import {Settings} from './settings/settings'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')
;(async () => {
  const assets = await AssetLoader.load()
  const game = Game.make(window, canvas, assets, Settings.defaults)
  Game.start(game)
})()
