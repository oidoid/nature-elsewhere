import {Game} from './game'
import {Settings} from './settings/settings'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')

Game.load().then(({atlas, atlasImage, shaderLayout}) => {
  const game = new Game(
    window,
    canvas,
    atlasImage,
    atlas,
    shaderLayout,
    Settings.defaults
  )
  game.start()
})
