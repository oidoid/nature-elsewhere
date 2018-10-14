import * as game from './game.js'

const atlas = new Image()
atlas.onload = () => {
  const gameState = game.newState(document, atlas)
  game.nextStartState(gameState, document)
}
atlas.src = '/assets/atlas.png'
