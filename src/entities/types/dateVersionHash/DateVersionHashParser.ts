import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {DateVersionHash} from './DateVersionHash'
import {Build} from '../../../utils/Build'
import {Atlas} from '../../../atlas/atlas/Atlas'
import {TextConfig} from '../text/TextConfig'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'

import {IEntityParser} from '../../RecursiveEntityParser'

export namespace DateVersionHashParser {
  export function parse(
    dateVersionHash: Entity,
    atlas: Atlas,
    parser: IEntityParser
  ): DateVersionHash {
    if (
      !EntityTypeUtil.assert<DateVersionHash>(
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
