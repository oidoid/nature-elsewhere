import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'
import {Layer} from '../../images/layer'

export namespace BorderBox {
  export enum Border {
    SOLID = AnimationID.PIXEL,
    DOTTED = AnimationID.CHECKERBOARD
  }

  export function create(
    atlas: Atlas.Definition,
    backgroundColor: number,
    backgroundLayer: Layer,
    border: Border,
    borderLayer: Layer,
    borderColor: number,
    {w, h}: WH // Size not including border.
  ): readonly Image[] {
    const borderID = <AnimationID>(<unknown>border)
    const newBorder = Image.newBind(atlas, borderID, {
      palette: borderColor,
      layer: borderLayer
    })
    return [
      Image.new(atlas, AnimationID.PIXEL, {
        palette: backgroundColor,
        layer: backgroundLayer,
        wh: {w, h},
        position: {x: 1, y: 1}
      }),
      newBorder({wh: {w, h: 1}, position: {x: 1, y: 0}}),
      newBorder({wh: {w: 1, h}, position: {x: 1 + w, y: 1}}),
      newBorder({wh: {w, h: 1}, position: {x: 1, y: 1 + h}}),
      newBorder({wh: {w: 1, h}, position: {x: 0, y: 1}})
    ]
  }
}
