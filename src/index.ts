import * as asepriteParser from './parsers/aseprite-parser'
import * as atlasAseprite from './assets/atlas.json'
import * as imageLoader from './loaders/image-loader'
import {AtlasDefinition} from './images/atlas-definition'
import {Game} from './game'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')

const atlas: AtlasDefinition = asepriteParser.parse(atlasAseprite)
let game: Game

function load(GameConstructor: typeof Game, level?: Level): void {
  imageLoader
    .loadImages('assets/images/atlas.png', 'assets/images/palette.png')
    .then(([atlasImage, paletteImage]) => {
      game = new GameConstructor(
        window,
        canvas,
        atlasImage,
        atlas,
        paletteImage,
        level
      )
      game.start()
    })
}

load(Game)

if (module.hot) {
  module.hot.accept('./game', () => {
    if (game) game.stop()
    load(require('./game').Game, game.level())
  })
}
