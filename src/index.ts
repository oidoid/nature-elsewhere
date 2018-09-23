import * as game from './game'

const atlasTexture = new Image()
atlasTexture.onload = _ => {
  const gameState = game.newState(document, atlasTexture)
  game.nextStartState(gameState, document)
}
atlasTexture.src = '/assets/atlas.png'
