import {Entity} from '../../entity/Entity'
import {EntityConfig} from '../../entity/EntityParser'
import {ImageParser, LayerKeyConfig} from '../../image/ImageParser'
import {Text} from './Text'
import {WHConfig, WHParser} from '../../math/WHParser'
import {XYConfig} from '../../math/XYParser'

export interface TextPropsConfig extends EntityConfig {
  readonly text?: string
  readonly textLayer?: LayerKeyConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}

export namespace TextPropsParser {
  export function parse(
    props: Entity.Props,
    config: TextPropsConfig
  ): NonOptional<Text.Props, 'type'> {
    return {
      ...props,
      ...(config.text && {text: config.text}),
      ...(config.textLayer !== undefined && {
        textLayer: ImageParser.parseLayerKey(config.textLayer)
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
