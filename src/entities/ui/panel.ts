import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {BorderBox} from './border-box'
import {Image} from '../../images/image'
import {Palette} from '../../images/palette'
import {Text} from '../../text/text'

export namespace Panel {
  export function create(
    atlas: Atlas.Definition,
    title: string,
    layer: number, // layer, layer +3
    target: WH
  ): ReadonlyArray<Image> {
    const box = BorderBox.create(
      atlas,
      Palette.YELLOWS,
      BorderBox.Border.DOTTED,
      Palette.GREYS,
      layer,
      target
    )
    const text = Text.toImages(atlas, title, {layer: layer + 3})
    const textBackground = Image.new(atlas, AnimationID.PIXEL, {
      palette: Palette.YELLOWS,
      position: {x: -1, y: -1},
      wh: {w: Image.target(text).w + 2, h: Image.target(text).h + 2},
      layer: layer + 2
    })
    Image.moveBy({x: 3, y: -2}, [textBackground, ...text])
    return [...box, textBackground, ...text]
  }
}
