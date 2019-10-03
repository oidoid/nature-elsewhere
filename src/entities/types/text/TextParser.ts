import {Atlas} from 'aseprite-atlas'
import {Entity} from '../../../entity/Entity'
import {EntityConfig} from '../../../entity/EntityParser'
import {ImageParser, LayerKeyConfig} from '../../../image/ImageParser'
import {Text} from './Text'
import {WHConfig, WHParser} from '../../../math/WHParser'
import {XYConfig} from '../../../math/XYParser'

export interface TextConfig extends EntityConfig {
  readonly text?: string
  readonly textLayer: LayerKeyConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}

export namespace TextParser {
  export function parse(
    config: TextConfig,
    props: Entity.Props,
    atlas: Atlas
  ): Text {
    return new Text(
      {
        ...props,
        text: config.text,
        textLayer: ImageParser.parseLayerKey(config.textLayer),
        textScale: ImageParser.parseScale(config.textScale),
        textMaxSize: WHParser.parse(config.textMaxSize)
      },
      atlas
    )
  }
}
