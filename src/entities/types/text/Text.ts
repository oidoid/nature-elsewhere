import {Entity} from '../../../entity/Entity'
import {Layer} from '../../../image/Layer'
import {Limits} from '../../../math/Limits'
import {WH} from '../../../math/WH'
import {XY} from '../../../math/XY'
import {Atlas} from 'aseprite-atlas'
import {Rect} from '../../../math/Rect'
import {TextLayout} from '../../../text/TextLayout'
import {Image} from '../../../image/Image'
import {AtlasID, MEM_FONT_PREFIX} from '../../../atlas/AtlasID'
import {ImageParser} from '../../../image/ImageParser'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'
import {EntityType} from '../../../entity/EntityType'
import {ImageRect} from '../../../imageStateMachine/ImageRect'

export class Text extends Entity {
  text: string
  readonly textLayer: Layer
  readonly textScale: XY
  readonly textMaxSize: WH

  constructor(atlas: Atlas, props?: Text.Props) {
    super({
      type: EntityType.UI_TEXT,
      state: TextState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [TextState.VISIBLE]: new ImageRect()
      },
      updatePredicate: UpdatePredicate.ALWAYS,
      ...props
    })

    this.text = (props && props.text) || ''
    this.textLayer = (props && props.textLayer) || Layer.UI_LO
    this.textScale = (props && props.textScale) || new XY(1, 1)
    this.textMaxSize =
      (props && props.textMaxSize) || new WH(Limits.maxShort, Limits.maxShort)

    const textImages = toImages(
      atlas,
      this.text,
      this.textScale,
      {
        position: this.imageRect().bounds.position,
        size: new WH(
          this.textMaxSize && this.textMaxSize.w
            ? this.textMaxSize.w
            : Limits.maxShort,

          this.textMaxSize && this.textMaxSize.h
            ? this.textMaxSize.h
            : Limits.maxShort
        )
      },
      this.imageRect().imageID
    )
    if (this.textLayer)
      for (const image of textImages) image.elevate(this.textLayer)

    this.addImages(...textImages)
  }
}

export namespace Text {
  export interface Props extends Entity.Props {
    readonly text?: string
    readonly textLayer?: Layer
    readonly textScale?: XY
    readonly textMaxSize?: WH
  }
}

export enum TextState {
  VISIBLE = 'visible'
}

/** @arg y The vertical scroll offset in pixels. */
function toImages(
  atlas: Atlas,
  string: string,
  scale: XY,
  bounds: Rect,
  imageID?: AtlasID,
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
      new XY(
        bounds.position.x + position.x,
        bounds.position.y + position.y - y
      ),
      scale,
      imageID,
      atlas
    )
    images.push(char)
  }
  return images
}

function newCharacterImage(
  char: number,
  position: XY,
  scale: XY,
  imageID: Maybe<AtlasID>,
  atlas: Atlas
): Image {
  const id = MEM_FONT_PREFIX + char.toString().padStart(3, '0')
  return ImageParser.parse(
    {id, bounds: {position}, scale, imageID, alphaComposition: 'SOURCE_MASK'},
    atlas
  )
}
