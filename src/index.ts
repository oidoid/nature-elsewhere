import * as atlasJSON from './assets/atlas.json'
import {AsepriteParser} from './parsers/aseprite-parser'
import {Atlas} from './images/atlas'
import {Game} from './game'
import {ImageLoader} from './loaders/image-loader'
import {Settings} from './settings/settings'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas missing.')

const atlas: Atlas.Definition = AsepriteParser.parse(atlasJSON)

ImageLoader.loadImages(
  'assets/images/atlas.png',
  'assets/images/palette.png'
).then(([atlasImage, paletteImage]) => {
  const game = new Game(
    window,
    canvas,
    atlasImage,
    atlas,
    paletteImage,
    Settings.preset
  )
  game.start()
})
