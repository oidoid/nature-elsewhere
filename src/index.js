import {Game} from './game.js'

const atlas = new Image()
atlas.onload = () => {
  const game = new Game(window, atlas)
  game.bind()
  game.start()
}
atlas.src = '/assets/atlas.png'
