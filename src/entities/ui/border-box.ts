import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'

export namespace BorderBox {
  export enum Border {
    SOLID = AnimationID.PIXEL,
    DOTTED = AnimationID.CHECKERBOARD
  }

  export function create(
    atlas: Atlas.Definition,
    backgroundColor: number,
    border: Border,
    borderColor: number,
    layer: number, // Uses layer and layer + 1/
    {w, h}: WH // Size not including border.
  ): ReadonlyArray<Image> {
    const borderID = <AnimationID>(<unknown>border)
    return [
      Image.new(atlas, AnimationID.PIXEL, {
        palette: backgroundColor,
        layer,
        wh: {w, h},
        position: {x: 1, y: 1}
      }),
      Image.new(atlas, borderID, {
        palette: borderColor,
        layer: layer + 1,
        wh: {w, h: 1},
        position: {x: 1, y: 0}
      }),
      Image.new(atlas, borderID, {
        palette: borderColor,
        layer: layer + 1,
        wh: {w, h: 1},
        position: {x: 1, y: 1 + h}
      }),
      Image.new(atlas, borderID, {
        palette: borderColor,
        layer: layer + 1,
        wh: {w: 1, h},
        position: {x: 0, y: 1}
      }),
      Image.new(atlas, borderID, {
        palette: borderColor,
        layer: layer + 1,
        wh: {w: 1, h},
        position: {x: 1 + w, y: 1}
      })
    ]
  }
}
