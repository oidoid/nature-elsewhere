import * as Game from './game'
import * as Settings from './settings/settings'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')

Game.load().then(({atlas, atlasImage, shaderLayout}) => {
  const game = Game.make(
    window,
    canvas,
    atlasImage,
    atlas,
    shaderLayout,
    Settings.defaults
  )
  Game.start(game)
})
