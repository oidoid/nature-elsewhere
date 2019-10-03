import {Atlas} from 'aseprite-atlas'
import {Build} from '../../../utils/Build'
import {Entity} from '../../../entity/Entity'
import {TextConfig, TextParser} from '../text/TextParser'
import {Text} from '../text/Text'

export namespace DateVersionHashParser {
  export function parse(
    config: TextConfig,
    props: Entity.Props,
    atlas: Atlas
  ): Text {
    const {date, version, hash} = Build
    return TextParser.parse(
      {...config, text: `${date} v${version} (${hash})`},
      props,
      atlas
    )
  }
}
