import * as SpriteFactory from '../sprites/sprite-factory'
import {I16_MIN, I16_MAX} from '../../limits'
import {Sprite, DrawOrder} from '../sprites/sprite'
import {TALL_GRASS_TEXTURE_KEYS} from '../textures/texture'
import {range, flatten} from '../../util'

const minRenderHeight = 128

export namespace Level0 {
  export const Map = {
    width: 1024,
    height: 128,
    sprites: (<Sprite[]>[])
      .concat(
        SpriteFactory.newPalette3(
          {x: I16_MIN / 2, y: I16_MIN / 2, z: DrawOrder.BACKGROUND},
          {x: I16_MAX, y: I16_MAX}
        )
      )
      .concat(SpriteFactory.newPlayer({x: 35, y: 70}))
      .concat(SpriteFactory.newPond({x: 32, y: 64}, 1))
      .concat(
        SpriteFactory.newGrassL({x: -minRenderHeight * 8, y: 60}, {x: 66, y: 1})
      )
      .concat(SpriteFactory.newGrassL({x: 208, y: 60}, {x: 2, y: 1}))
      .concat(SpriteFactory.newTallGrass('TALL_GRASS_A', {x: 188, y: 71}))
      .concat(SpriteFactory.newTallGrass('TALL_GRASS_B', {x: 208, y: 71}))
      .concat(
        range(0, 20)
          .map(i =>
            SpriteFactory.newTallGrass(
              TALL_GRASS_TEXTURE_KEYS[
                Math.floor(Math.random() * TALL_GRASS_TEXTURE_KEYS.length)
              ],
              {x: 228 + i * 4, y: 71}
            )
          )
          .reduce(flatten)
      )
      .concat(SpriteFactory.newGrassL({x: 228, y: 60}, {x: 6, y: 1}))
      .concat(SpriteFactory.newTree({x: 185, y: 48}))
      .concat(SpriteFactory.newCloudS({x: 40, y: 20}))
      .concat(SpriteFactory.newCloudM({x: 58, y: 16}))
      .concat(SpriteFactory.newRainCloud('CLOUD_S', {x: 75, y: 18}, -0.08))
      .concat(SpriteFactory.newCloudXL({x: 120, y: 10}))
      .concat(SpriteFactory.newRainCloud('CLOUD_L', {x: 20, y: -10}, -0.1))
      .concat(SpriteFactory.newQuicksand({x: 160, y: 75}, 3))
      .concat(SpriteFactory.newQuicksand({x: 176, y: 75}, 3))
      .sort((lhs, rhs) => rhs.position.z - lhs.position.z)
  }
}
