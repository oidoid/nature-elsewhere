import {ImageComposition} from './ImageComposition'
import {ImageCompositionConfig} from './ImageCompositionConfig'

export namespace ImageCompositionParser {
  export function parse(config: ImageCompositionConfig): ImageComposition {
    if (!config) return ImageComposition.SOURCE
    if (!(config in ImageComposition))
      throw new Error(`Unknown ImageComposition "${config}".`)
    return typeof config === 'number'
      ? config
      : ImageComposition[<keyof typeof ImageComposition>config]
  }
}
