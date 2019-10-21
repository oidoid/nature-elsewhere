import {Atlas} from 'aseprite-atlas'
import {SpriteConfig} from '../sprite/SpriteConfig'
import {SpriteParser} from '../sprite/SpriteParser'
import {SpriteRect} from './SpriteRect'
import {XYConfig} from '../math/XYConfig'
import {XYParser} from '../math/XYParser'

export type SpriteRectConfig = Maybe<{
  readonly origin?: XYConfig
  readonly scale?: XYConfig
  readonly sprites?: readonly SpriteConfig[]
}>

export namespace SpriteRectParser {
  export function parse(atlas: Atlas, config: SpriteRectConfig): SpriteRect {
    if (!config) return new SpriteRect()
    const origin = XYParser.parse(config.origin)
    const scale = SpriteParser.parseScale(config.scale)
    const sprites = (config.sprites ?? []).map(sprite =>
      SpriteParser.parse(atlas, sprite)
    )
    const rect = new SpriteRect({origin, sprites, scale})
    return rect
  }
}
