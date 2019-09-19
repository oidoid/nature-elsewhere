import {Atlas} from '../../../atlas/atlas/atlas'
import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {Limits} from '../../../math/limits'
import {Image} from '../../../images/image/image'
import {Layer} from '../../../images/layer/layer'
import {XY} from '../../../math/xy/xy'
import {TextLayout} from '../../../text/text-layout/text-layout'
import {Rect} from '../../../math/rect/rect'
import {RectArray} from '../../../math/rect-array/rect-array'
import {XYParser} from '../../../math/xy/xy-parser'
import {ImageParser} from '../../../images/image/image-parser'
import {Text} from './text'
import {UI_MEM_FONT_PREFIX} from '../../../atlas/atlas-id/atlas-id'

export namespace TextParser {
  export function parse(text: Entity, atlas: Atlas): Text {
    if (!EntityType.assert<Text>(text, EntityType.UI_TEXT)) throw new Error()

    const textImages = toImages(
      atlas,
      text.text,
      text.textLayer,
      XYParser.parse(text.textScale),
      {
        x: Entity.imageState(text).origin.x,
        y: Entity.imageState(text).origin.y,
        w:
          text.textMaxSize && text.textMaxSize.w
            ? text.textMaxSize.w
            : Limits.maxShort,
        h:
          text.textMaxSize && text.textMaxSize.h
            ? text.textMaxSize.h
            : Limits.maxShort
      }
    )

    // Images are added dynamically but ImageRect expects a static configuration
    // determined at parse time. Recalculate the bounds.
    Entity.imageState(text).images.push(...textImages)
    const union = RectArray.union(
      Entity.imageState(text).images.map(image => image.bounds)
    )
    if (union) {
      Entity.imageState(text).bounds.x = union.x
      Entity.imageState(text).bounds.y = union.y
      Entity.imageState(text).bounds.w = union.w
      Entity.imageState(text).bounds.h = union.h
    }
    Entity.invalidateBounds(text)
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
    const {positions} = TextLayout.layout(string, bounds.w, scale)
    for (let i = 0; i < positions.length; ++i) {
      const position = positions[i]
      if (!position) continue
      if (TextLayout.nextLine(position.y, scale).y < y) continue
      if (position.y > y + bounds.h) break

      images.push(
        newCharacterImage(
          string.charCodeAt(i),
          {x: bounds.x + position.x, y: bounds.y + position.y - y},
          layer,
          scale,
          atlas
        )
      )
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
  const id = UI_MEM_FONT_PREFIX + char
  return ImageParser.parse({id, bounds: position, layer, scale}, atlas)
}
