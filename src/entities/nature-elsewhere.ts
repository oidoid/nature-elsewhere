import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {Palette} from '../images/palette'

export namespace NatureElsewhere {
  export function create(
    atlas: Atlas.Definition,
    layer: number,
    position: XY
  ): readonly Image[] {
    return [
      Image.new(atlas, AnimationID.NATURE_ELSEWHERE, {
        palette: Palette.GREENS,
        layer: layer + 1,
        position,
        scale: {x: 2, y: 2}
      }),
      Image.new(atlas, AnimationID.RAIN, {
        palette: Palette.BLUES,
        layer,
        position,
        offsetRate: {x: 0, y: -0.0005},
        maskAnimationID: AnimationID.NATURE_ELSEWHERE,
        maskOffset: {x: 0, y: 0},
        maskOffsetRate: {x: 0, y: 0},
        scale: {x: 2, y: 2}
      }),
      Image.new(atlas, AnimationID.RAIN, {
        palette: Palette.BLUES,
        layer,
        position,
        offset: {x: 1, y: 3},
        offsetRate: {x: 0, y: -0.001},
        maskAnimationID: AnimationID.NATURE_ELSEWHERE,
        maskOffset: {x: 0, y: 0},
        maskOffsetRate: {x: 0, y: 0},
        scale: {x: 2, y: 2}
      })
    ]
  }
}
