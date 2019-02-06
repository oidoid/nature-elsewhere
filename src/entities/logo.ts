import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'
import {Palette} from '../images/palette'

export function newLogo(
  atlas: AtlasDefinition,
  layer: number,
  position: XY
): ReadonlyArray<Image> {
  return [
    Image.new(atlas, AnimationID.NATURE_ELSEWHERE, {
      layer: layer + 1,
      position,
      scale: {x: 2, y: 2}
    }),
    Image.new(atlas, AnimationID.RAIN, {
      layer,
      position,
      offsetRate: {x: 0, y: -0.0003},
      maskAnimationID: AnimationID.NATURE_ELSEWHERE,
      palette: Palette.ALTERNATE,
      scale: {x: 2, y: 2}
    }),
    Image.new(atlas, AnimationID.RAIN, {
      layer,
      position,
      offset: {x: 1, y: 3},
      offsetRate: {x: 0, y: -0.001},
      maskAnimationID: AnimationID.NATURE_ELSEWHERE,
      scale: {x: 2, y: 2}
    })
  ]
}
