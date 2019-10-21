import {LevelLink} from './LevelLink'
import {LevelLinkPropsConfig} from './LevelLinkPropsConfig'
import {LevelTypeParser} from '../../levels/LevelTypeParser'
import {TextParser} from '../text/TextParser'

export namespace LevelLinkParser {
  export function parseProps(config: LevelLinkPropsConfig): LevelLink.Props {
    const props: Writable<LevelLink.Props> = {}
    const {text, textLayer, textScale, textMaxSize} = TextParser.parseProps(
      config
    )
    if (text !== undefined) props.text = text
    if (textLayer !== undefined) props.textLayer = textLayer
    if (textScale !== undefined) props.textScale = textScale
    if (textMaxSize !== undefined) props.textMaxSize = textMaxSize
    if (config.link !== undefined)
      props.link = LevelTypeParser.parse(config.link)
    return props
  }
}
