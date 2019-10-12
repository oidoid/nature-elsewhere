import {Entity} from '../../entity/Entity'
import {Layer} from '../../image/Layer'
import {Limits} from '../../math/Limits'
import {WH} from '../../math/WH'
import {XY} from '../../math/XY'
import {Atlas} from 'aseprite-atlas'
import {Rect} from '../../math/Rect'
import {TextLayout} from '../../text/TextLayout'
import {Image} from '../../image/Image'
import {AtlasID, MEM_FONT_PREFIX} from '../../atlas/AtlasID'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'
import {EntityType} from '../../entity/EntityType'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {JSONObject} from '../../utils/JSON'
import {AlphaComposition} from '../../image/AlphaComposition'
import {ObjectUtil} from '../../utils/ObjectUtil'

export class Text extends Entity<Text.Variant, Text.State> {
  text: string
  readonly textLayer: Layer
  readonly textScale: XY
  readonly textMaxSize: WH

  constructor(atlas: Atlas, props?: Text.Props<Text.Variant, Text.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Text.State.VISIBLE]: new ImageRect()
      },
      ...props
    })

    this.text = (props && props.text) || defaults.text
    this.textLayer = (props && props.textLayer) || defaults.textLayer
    this.textScale = (props && props.textScale) || defaults.textScale.copy()
    this.textMaxSize =
      (props && props.textMaxSize) || defaults.textMaxSize.copy()

    const textImages = toImages(
      atlas,
      this.text,
      this.textScale,
      {
        position: this.imageBounds().position.copy(),
        size: new WH(
          this.textMaxSize && this.textMaxSize.w
            ? this.textMaxSize.w
            : Limits.maxShort,

          this.textMaxSize && this.textMaxSize.h
            ? this.textMaxSize.h
            : Limits.maxShort
        )
      },
      this.imageID()
    )
    if (this.textLayer)
      for (const image of textImages) image.elevate(this.textLayer)

    this.addImages(...textImages)
  }

  toJSON(): JSONObject {
    const diff = this._toJSON(defaults)
    if (this.text !== defaults.text) diff.text = this.text
    if (this.textLayer !== defaults.textLayer) diff.textLayer = this.textLayer
    if (!this.textScale.equal(defaults.textScale))
      diff.textScale = {
        ...(this.textScale.x !== defaults.textScale.x && {x: this.textScale.x}),
        ...(this.textScale.y !== defaults.textScale.y && {y: this.textScale.y})
      }
    if (!this.textMaxSize.equal(defaults.textMaxSize))
      diff.textMaxSize = {
        ...(this.textMaxSize.w !== defaults.textMaxSize.w && {
          w: this.textMaxSize.w
        }),
        ...(this.textMaxSize.h !== defaults.textMaxSize.h && {
          h: this.textMaxSize.h
        })
      }
    return diff
  }
}

export namespace Text {
  export enum Variant {
    NONE = 'none'
  }
  export enum State {
    VISIBLE = 'visible'
  }

  export interface Props<
    Variant extends string = string,
    State extends string = Text.State
  > extends Entity.SubProps<Variant, State> {
    readonly text?: string
    readonly textLayer?: Layer
    readonly textScale?: XY
    readonly textMaxSize?: WH
  }
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
  const {chars} = TextLayout.layout(string, bounds.size.w, scale)
  for (let i = 0; i < chars.length; ++i) {
    const char = chars[i]
    if (!char) continue
    if (TextLayout.nextLine(char.position.y, scale).y < y) continue
    if (char.position.y > y + bounds.size.h) break

    const image = newCharacterImage(
      string.charCodeAt(i),
      new XY(
        bounds.position.x + char.position.x,
        bounds.position.y + char.position.y - y
      ),
      // Size is only needed for the last character to ensure minimal width
      // instead of maximal letter width bounding (five pixels, at time of
      // writing, which may be a good bit larger than some single pixel
      // character like an exclamation mark.)
      char.size,
      scale,
      imageID,
      atlas
    )
    images.push(image)
  }
  return images
}

function newCharacterImage(
  char: number,
  position: XY,
  size: WH,
  scale: XY,
  imageID: Maybe<AtlasID>,
  atlas: Atlas
): Image {
  const id = <AtlasID>(MEM_FONT_PREFIX + char.toString().padStart(3, '0'))
  const alphaComposition = AlphaComposition.SOURCE_MASK
  return new Image(atlas, {
    id,
    position,
    size,
    scale,
    imageID,
    alphaComposition
  })
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_TEXT,
  variant: Text.Variant.NONE,
  state: Text.State.VISIBLE,
  updatePredicate: UpdatePredicate.ALWAYS,
  text: '',
  textLayer: Layer.UI_LO,
  textScale: new XY(1, 1),
  textMaxSize: new WH(Limits.maxShort, Limits.maxShort)
})
