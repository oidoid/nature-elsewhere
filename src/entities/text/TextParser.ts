import {LayerParser} from '../../sprite/LayerParser'
import {SpriteParser} from '../../sprite/SpriteParser'
import {Text} from './Text'
import {TextPropsConfig} from './TextPropsConfig'
import {WHParser} from '../../math/WHParser'

export namespace TextParser {
  export function parseProps(config: TextPropsConfig): Text.Props {
    const props: Writable<Text.Props> = {}
    if (config.text !== undefined) props.text = config.text
    if (config.textLayer !== undefined)
      props.textLayer = LayerParser.parse(config.textLayer)
    if (config.textScale !== undefined)
      props.textScale = SpriteParser.parseScale(config.textScale)
    if (config.textMaxSize !== undefined)
      props.textMaxSize = WHParser.parse(config.textMaxSize)
    return props
  }
}
