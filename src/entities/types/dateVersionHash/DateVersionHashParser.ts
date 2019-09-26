import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'
import {DateVersionHash} from './DateVersionHash'
import {Build} from '../../../utils/Build'
import {Atlas} from '../../../atlas/Atlas'

import {IEntityParser} from '../../RecursiveEntityParser'
import {TextConfig} from '../text/TextParser'

export namespace DateVersionHashParser {
  export function parse(
    dateVersionHash: Entity,
    atlas: Atlas,
    parser: IEntityParser
  ): DateVersionHash {
    if (
      !Entity.assert<DateVersionHash>(
        dateVersionHash,
        EntityType.UI_DATE_VERSION_HASH
      )
    )
      throw new Error()

    const {date, version, hash} = Build
    const config: TextConfig = {
      type: EntityType.UI_TEXT,
      text: `${date} v${version} (${hash})`,
      textLayer: dateVersionHash.textLayer,
      textScale: dateVersionHash.textScale,
      textMaxSize: dateVersionHash.textMaxSize,
      position: {...dateVersionHash.bounds.position}
    }
    const text = parser(config, atlas)
    dateVersionHash.children.push(text)
    Entity.invalidateBounds(dateVersionHash)

    return dateVersionHash
  }
}
