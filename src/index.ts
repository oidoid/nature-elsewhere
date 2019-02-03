import * as asepriteParser from './parsers/aseprite-parser'
import * as atlasAseprite from './assets/atlas.json'
import * as imageLoader from './loaders/image-loader'
import {AtlasDefinition} from './images/atlas-definition'
import {Game} from './game'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')

const atlas: AtlasDefinition = asepriteParser.parse(atlasAseprite)

imageLoader
  .loadImages('assets/atlas.png', 'assets/palettes.png')
  .then(([atlasImage, palettesImage]) => {
    const game = new Game(window, canvas, atlasImage, atlas, palettesImage)
    game.start()
  })
