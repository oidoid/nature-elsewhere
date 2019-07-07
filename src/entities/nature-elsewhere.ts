import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {Layer} from '../images/layer'
import {Palette} from '../images/palette'

export namespace NatureElsewhere {
  export function create(
    atlas: Atlas.Definition,
    position: XY
  ): readonly Image[] {
    const newRain = Image.newBind(atlas, AnimationID.RAIN, {
      palette: Palette.BLUES,
      layer: Layer.UI_LO,
      position,
      maskOffset: {x: 0, y: 0},
      maskOffsetRate: {x: 0, y: 0},
      maskAnimationID: AnimationID.NATURE_ELSEWHERE,
      scale: {x: 2, y: 2}
    })
    return [
      Image.new(atlas, AnimationID.NATURE_ELSEWHERE, {
        palette: Palette.GREENS,
        layer: Layer.UI_MID,
        position,
        scale: {x: 2, y: 2}
      }),
      newRain({offsetRate: {x: 0, y: -0.0005}}),
      newRain({offset: {x: 1, y: 3}, offsetRate: {x: 0, y: -0.001}})
    ]
  }
}
