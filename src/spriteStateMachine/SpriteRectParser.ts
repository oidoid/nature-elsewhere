import {Atlas} from 'aseprite-atlas'
import {SpriteParser} from '../sprite/SpriteParser'
import {SpriteRect} from './SpriteRect'
import {SpriteRectConfig} from './SpriteRectConfig'
import {XYParser} from '../math/XYParser'

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
