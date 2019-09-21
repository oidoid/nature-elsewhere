import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {DateVersionHash} from './date-version-hash'
import {Build} from '../../../utils/build'
import {Atlas} from '../../../atlas/atlas/atlas'
import {TextConfig} from '../text/text-config'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'
import {IEntityParser} from '../../recursive-entity-parser'

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
      position: {x: dateVersionHash.bounds.x, y: dateVersionHash.bounds.y}
    }
    const text = parser(config, atlas)
    dateVersionHash.children.push(text)
    EntityUtil.invalidateBounds(dateVersionHash)

    return dateVersionHash
  }
}
