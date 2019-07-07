import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {BorderBox} from './border-box'
import {Image} from '../../images/image'
import {Layer} from '../../images/layer'
import {Palette} from '../../images/palette'
import {Text} from '../../text/text'

export namespace Panel {
  export function create(
    atlas: Atlas.Definition,
    title: string,
    target: WH
  ): readonly Image[] {
    const box = BorderBox.create(
      atlas,
      Palette.YELLOWS,
      Layer.UI_MID,
      BorderBox.Border.DOTTED,
      Layer.UI_MID,
      Palette.GREYS,
      target
    )
    const text = Text.toImages(atlas, title)
    const textBackground = Image.new(atlas, AnimationID.PIXEL, {
      palette: Palette.YELLOWS,
      position: {x: -1, y: -1},
      wh: {w: Image.target(text).w + 2, h: Image.target(text).h + 2},
      layer: Layer.UI_HI
    })
    Image.moveBy({x: 3, y: -2}, [textBackground, ...text])
    return [...box, textBackground, ...text]
  }
}
