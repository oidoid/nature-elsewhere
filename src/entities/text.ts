import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {Image} from '../images/image'
import {ImageConfig} from '../images/image-config'
import {ImageParser} from '../images/image-parser'
import {TextLayout} from '../text/text-layout'
import {WH} from '../math/wh'

export interface Text extends Entity {
  readonly id: 'text'
  readonly text: string
}
type t = Text

export namespace Text {
  export const make = (atlas: Atlas, entity: Entity | Text): t => {
    if (!isTextEntityConfig(entity))
      throw new Error(`Unknown ID "${entity.id}".`)
    const {scale} = entity
    const images = toImages(atlas, entity.text, {scale})
    return {...entity, states: {'0': {x: 0, y: 0, w: 0, h: 0, images}}}
  }

  const isTextEntityConfig = (val: Entity): val is t => val.id === 'text'
}

/** @arg y The vertical scroll offset in pixels.
    @arg target The window size in pixels. */
export const toImages = (
  atlas: Atlas,
  string: string,
  cfg?: Omit<ImageConfig, 'id'>,
  y: number = 0,
  {w, h}: WH = {w: Number.POSITIVE_INFINITY, h: Number.POSITIVE_INFINITY}
): readonly Image[] => {
  const images = []
  const scale = {
    x: (cfg && cfg.scale && cfg.scale.x) || 1,
    y: (cfg && cfg.scale && cfg.scale.y) || 1
  }
  const {positions} = TextLayout.layout(string, w, scale)
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    if (!position) continue
    if (TextLayout.nextLine(position.y, scale).y < y) continue
    if (position.y > y + h) break

    const id = 'mem-font ' + string.charCodeAt(i)
    const image = ImageParser.parse(atlas, {
      id,
      ...cfg,
      x: ((cfg && cfg.x) || 0) + position.x,
      y: ((cfg && cfg.y) || 0) + position.y - y
    })
    images.push(image)
  }
  return images
}
