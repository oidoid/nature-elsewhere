import {Atlas} from 'aseprite-atlas'
import {Checkbox} from './Checkbox'
import {Entity} from '../../../entity/Entity'
import {ImageParser} from '../../../image/ImageParser'
import {TextConfig} from '../text/TextParser'
import {WHParser} from '../../../math/WHParser'

export namespace CheckboxParser {
  export function parse(
    config: TextConfig,
    props: Entity.Props,
    atlas: Atlas
  ): Checkbox {
    return new Checkbox(atlas, {
      ...props,
      text: config.text,
      textLayer: ImageParser.parseLayerKey(config.textLayer),
      textScale: ImageParser.parseScale(config.textScale),
      textMaxSize: WHParser.parse(config.textMaxSize)
    })
  }
}
