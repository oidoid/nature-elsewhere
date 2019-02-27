import * as asepriteParser from './parsers/aseprite-parser'
import * as atlasAseprite from './assets/atlas.json'
import * as imageLoader from './loaders/image-loader'
import {AtlasDefinition} from './images/atlas-definition'
import {Game} from './game'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')

const atlas: AtlasDefinition = asepriteParser.parse(atlasAseprite)

imageLoader
  .loadImages('assets/images/atlas.png', 'assets/images/palette.png')
  .then(([atlasImage, paletteImage]) => {
    const game = new Game(window, canvas, atlasImage, atlas, paletteImage)
    game.start()
  })
