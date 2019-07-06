import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'
import {Palette} from '../../images/palette'
import {Random} from '../../math/random'

const grassIDs: readonly AnimationID[] = Object.freeze([
  AnimationID.TALL_GRASS_A,
  AnimationID.TALL_GRASS_B,
  AnimationID.TALL_GRASS_C,
  AnimationID.TALL_GRASS_D,
  AnimationID.TALL_GRASS_E,
  AnimationID.TALL_GRASS_F,
  AnimationID.TALL_GRASS_G,
  AnimationID.TALL_GRASS_H,
  AnimationID.TALL_GRASS_I
])

// creates a furry tile. all grasses are within bounds except those at the top
export namespace GrassTile {
  export function create(
    atlas: Atlas.Definition,
    layer: number,
    wh: WH,
    random: Random
  ): readonly Image[] {
    const grasses = []
    for (let i = 0, len = random.int(0, 8); i < len; ++i) {
      const id = randomGrassID(random)
      const position = {
        x: random.int(0, wh.w),
        y: random.int(0, wh.h - atlas.animations[id].size.h + 1)
      }
      grasses.push(
        Image.new(atlas, id, {
          palette: Palette.GREENS,
          layer: layer + 1,
          position,
          offset: {x: random.int(0, atlas.animations[id].size.w), y: 0},
          wh: {
            w: random.int(
              1,
              Math.min(atlas.animations[id].size.w * 2, wh.w - position.x)
            ),
            h: atlas.animations[id].size.h
          }
        })
      )
    }
    return grasses
  }
}

function randomGrassID(random: Random): AnimationID {
  return grassIDs[random.int(0, grassIDs.length)]
}
