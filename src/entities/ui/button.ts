import {Atlas} from '../../images/atlas'
import {BorderBox} from './border-box'
import {Image} from '../../images/image'
import {Palette} from '../../images/palette'
import {Text} from '../../text/text'

export namespace Button {
  export function create(
    atlas: Atlas.Definition,
    layer: number, // Uses layer and layer + 1
    wh: WH, // Size not including border.
    text: string
  ): ReadonlyArray<Image> {
    return [
      ...BorderBox.create(
        atlas,
        Palette.YELLOWS,
        BorderBox.Border.SOLID,
        Palette.GREYS,
        layer,
        wh
      ),
      ...Image.moveBy(
        {x: 5, y: 5},
        Text.toImages(atlas, text, {layer: layer + 1})
      )
    ]
  }
}
