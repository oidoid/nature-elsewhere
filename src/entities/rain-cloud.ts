import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {Layer} from '../images/layer'
import {Palette} from '../images/palette'

type Cloud =
  | AnimationID.CLOUD_XS
  | AnimationID.CLOUD_S
  | AnimationID.CLOUD_M
  | AnimationID.CLOUD_L
  | AnimationID.CLOUD_XL

export namespace RainCloud {
  export function create(
    atlas: Atlas.Definition,
    cloud: Cloud,
    layer: Layer,
    preScale: XY,
    offsetRate: XY
  ): readonly Image[] {
    const cloudImage = Image.new(atlas, cloud, {palette: Palette.GREYS, layer})
    return [
      cloudImage,
      Image.new(atlas, AnimationID.RAIN, {
        palette: Palette.BLUES,
        layer,
        position: {x: 1, y: cloudImage.target().h},
        preScale,
        offsetRate
      })
    ]
  }
}
