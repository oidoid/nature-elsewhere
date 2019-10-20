import {LevelLink} from './LevelLink'
import {LevelTypeConfig, LevelTypeParser} from '../../levels/LevelTypeParser'
import {TextParser, TextPropsConfig} from '../text/TextParser'

export interface LevelLinkPropsConfig extends TextPropsConfig {
  readonly link?: LevelTypeConfig
}

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
