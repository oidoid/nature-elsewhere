import {EntityConfig} from '../../entity/EntityParser'
import {ImageParser, LayerConfig} from '../../image/ImageParser'
import {Text} from './Text'
import {WHConfig, WHParser} from '../../math/WHParser'
import {XYConfig} from '../../math/XYParser'

export interface TextPropsConfig extends EntityConfig {
  readonly text?: string
  readonly textLayer?: LayerConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}

export namespace TextParser {
  export function parseProps(config: TextPropsConfig): Text.Props {
    return {
      ...(config.text && {text: config.text}),
      ...(config.textLayer !== undefined && {
        textLayer: ImageParser.parseLayer(config.textLayer)
      }),
      ...(config.textScale && {
        textScale: ImageParser.parseScale(config.textScale)
      }),
      ...(config.textMaxSize && {
        textMaxSize: WHParser.parse(config.textMaxSize)
      })
    }
  }
}
