import {Atlas} from '../../images/atlas'
import {BorderBox} from './border-box'
import {Image} from '../../images/image'
import {Layer} from '../../images/layer'
import {Palette} from '../../images/palette'
import {Text} from '../../text/text'

export namespace Button {
  export function create(
    atlas: Atlas.Definition,
    wh: WH, // Size not including border.
    text: string
  ): readonly Image[] {
    return [
      ...BorderBox.create(
        atlas,
        Palette.YELLOWS,
        Layer.UI_MID,
        BorderBox.Border.SOLID,
        Layer.UI_HI,
        Palette.GREYS,
        wh
      ),
      ...Image.moveBy({x: 5, y: 5}, Text.toImages(atlas, text))
    ]
  }
}
