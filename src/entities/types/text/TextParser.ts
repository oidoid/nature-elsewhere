import {Atlas} from '../../../atlas/atlas/Atlas'
import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {Limits} from '../../../math/Limits'
import {Image} from '../../../images/image/Image'
import {Layer} from '../../../images/layer/layer'
import {XY} from '../../../math/xy/XY'
import {TextLayout} from '../../../text/textLayout/TextLayout'
import {Rect} from '../../../math/rect/Rect'
import {XYParser} from '../../../math/xy/XYParser'
import {ImageParser} from '../../../images/image/ImageParser'
import {Text} from './Text'
import {MEM_FONT_PREFIX} from '../../../atlas/atlasID/AtlasID'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {EntityUtil} from '../../entity/EntityUtil'

export namespace TextParser {
  export function parse(text: Entity, atlas: Atlas): Text {
    if (!EntityTypeUtil.assert<Text>(text, EntityType.UI_TEXT))
      throw new Error()

    const textImages = toImages(
      atlas,
      text.text,
      text.textLayer,
      XYParser.parse(text.textScale),
      {
        position: EntityUtil.imageRect(text).bounds.position,
        size: {
          w:
            text.textMaxSize && text.textMaxSize.w
              ? text.textMaxSize.w
              : Limits.maxShort,
          h:
            text.textMaxSize && text.textMaxSize.h
              ? text.textMaxSize.h
              : Limits.maxShort
        }
      }
    )

    // Images are added dynamically but ImageRect expects a static configuration
    // determined at parse time. Recalculate the bounds.
    EntityUtil.imageRect(text).images.push(...textImages)
    const union = Rect.unionAll(
      EntityUtil.imageRect(text).images.map(image => image.bounds)
    )
    if (union) {
      EntityUtil.imageRect(text).bounds.position.x = union.position.x
      EntityUtil.imageRect(text).bounds.position.y = union.position.y
      EntityUtil.imageRect(text).bounds.size.w = union.size.w
      EntityUtil.imageRect(text).bounds.size.h = union.size.h
    }
    EntityUtil.invalidateBounds(text)
    return text
  }

  /** @arg y The vertical scroll offset in pixels. */
  function toImages(
    atlas: Atlas,
    string: string,
    layer: Layer.Key,
    scale: XY,
    bounds: Rect,
    y: number = 0
  ): readonly Image[] {
    const images = []
    const {positions} = TextLayout.layout(string, bounds.size.w, scale)
    for (let i = 0; i < positions.length; ++i) {
      const position = positions[i]
      if (!position) continue
      if (TextLayout.nextLine(position.y, scale).y < y) continue
      if (position.y > y + bounds.size.h) break

      const char = newCharacterImage(
        string.charCodeAt(i),
        {
          x: bounds.position.x + position.x,
          y: bounds.position.y + position.y - y
        },
        layer,
        scale,
        atlas
      )
      images.push(char)
    }
    return images
  }
}

function newCharacterImage(
  char: number,
  position: XY,
  layer: Layer.Key,
  scale: XY,
  atlas: Atlas
): Image {
  const id = MEM_FONT_PREFIX + char.toString().padStart(3, '0')
  return ImageParser.parse({id, bounds: {position}, layer, scale}, atlas)
}
