import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'
import {Palette} from '../images/palette'

export function newNatureElsewhere(
  atlas: AtlasDefinition,
  layer: number,
  position: XY
): ReadonlyArray<Image> {
  return [
    Image.new(atlas, AnimationID.NATURE_ELSEWHERE, Palette.GREENS, {
      layer: layer + 1,
      position,
      scale: {x: 2, y: 2}
    }),
    Image.new(atlas, AnimationID.RAIN, Palette.BLUES, {
      layer,
      position,
      offsetRate: {x: 0, y: -0.0005},
      maskAnimationID: AnimationID.NATURE_ELSEWHERE,
      scale: {x: 2, y: 2}
    }),
    Image.new(atlas, AnimationID.RAIN, Palette.BLUES, {
      layer,
      position,
      offset: {x: 1, y: 3},
      offsetRate: {x: 0, y: -0.001},
      maskAnimationID: AnimationID.NATURE_ELSEWHERE,
      scale: {x: 2, y: 2}
    })
  ]
}
