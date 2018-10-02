import * as game from './game'

const atlas = new Image()
atlas.onload = _ => {
  const gameState = game.newState(document, atlas)
  game.nextStartState(gameState, document)
}
atlas.src = '/assets/atlas.png'
