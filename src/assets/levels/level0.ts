import * as palette from './palette'
import * as SpriteFactory from '../sprites/sprite-factory'
import {Sprite} from '../sprites/sprite'
import {range} from '../../util'

const minRenderHeight = 128
const width = 16

export namespace Level0 {
  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    sprites: SpriteFactory.newPond({x: 32, y: 64}, 1)
      .concat(SpriteFactory.newPlayer({x: 35, y: 60}))
      .concat(
        range(-minRenderHeight * 8, 32, width).reduce(
          (sum: Sprite[], x) => [
            ...sum,
            ...SpriteFactory.newGrassL({x, y: 60})
          ],
          []
        )
      )
      .concat(SpriteFactory.newGrassL({x: 160, y: 60}))
      .concat(SpriteFactory.newGrassL({x: 176, y: 60}))
      .concat(SpriteFactory.newTree({x: 185, y: 44}))
      .concat(
        SpriteFactory.newCloudS({x: 40, y: 20})
          .concat(SpriteFactory.newCloudM({x: 58, y: 16}))
          .concat(SpriteFactory.newRainCloud('CLOUD_S', {x: 75, y: 18}, -0.08))
          .concat(SpriteFactory.newCloudXL({x: 120, y: 10}))
          .concat(SpriteFactory.newRainCloud('CLOUD_L', {x: 20, y: -10}, -0.1))
      )
      .concat(SpriteFactory.newQuicksand({x: 160, y: 75}, 3))
      .concat(SpriteFactory.newQuicksand({x: 176, y: 75}, 3))
  }
}
