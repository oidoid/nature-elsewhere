import * as asepriteParser from './parsers/aseprite-parser'
import * as atlasAseprite from './assets/atlas.json'
import * as imageLoader from './loaders/image-loader'
import {Game} from './game'

const canvas = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')

const atlasDefinition = asepriteParser.parse(atlasAseprite)

imageLoader
  .loadImages('assets/atlas.png', 'assets/palettes.png')
  .then(([atlas, palettes]) => {
    const game = new Game(window, canvas, atlas, atlasDefinition, palettes)
    game.start()
  })
