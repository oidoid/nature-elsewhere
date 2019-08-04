import {Game} from './game'
import {Settings} from './settings/settings'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')
;(async function() {
  const {atlas, atlasImage, shaderLayout} = await Game.load()
  const game = Game.make(
    window,
    canvas,
    atlasImage,
    atlas,
    shaderLayout,
    Settings.defaults
  )
  Game.start(game)
})()
