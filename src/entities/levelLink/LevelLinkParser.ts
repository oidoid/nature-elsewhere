import {LevelLink} from './LevelLink'
import {LevelTypeConfig, LevelTypeParser} from '../../levels/LevelTypeParser'
import {TextParser, TextPropsConfig} from '../text/TextParser'

export interface LinkPropsConfig extends TextPropsConfig {
  readonly link?: LevelTypeConfig
}

export namespace LevelLinkParser {
  export function parseProps(config: LinkPropsConfig): LevelLink.Props {
    const {text, textLayer, textScale, textMaxSize} = TextParser.parseProps(
      config
    )
    return {
      ...(text && {text}),
      ...(textLayer !== undefined && {textLayer}),
      ...(textScale && {textScale}),
      ...(textMaxSize && {textMaxSize}),
      ...(config.link && {link: LevelTypeParser.parse(config.link)})
    }
  }
}
