import {SpriteComposition} from './SpriteComposition'
import {SpriteCompositionConfig} from './SpriteCompositionConfig'

export namespace SpriteCompositionParser {
  export function parse(config: SpriteCompositionConfig): SpriteComposition {
    if (!config) return SpriteComposition.SOURCE
    if (!(config in SpriteComposition))
      throw new Error(`Unknown SpriteComposition "${config}".`)
    return typeof config === 'number'
      ? config
      : SpriteComposition[<keyof typeof SpriteComposition>config]
  }
}
