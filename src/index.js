import {Game} from './game.js'

const atlas = new Image()
atlas.onload = () => {
  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing.')

  const game = new Game(window, canvas, atlas)
  game.bind()
  game.start()
}
atlas.src = '/assets/atlas.png'
