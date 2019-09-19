import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {DateVersionHash} from './date-version-hash'
import {Build} from '../../../utils/build'
import {Atlas} from '../../../atlas/atlas/atlas'
import {TextConfig} from '../text/text-config'
import {EntityParser} from '../../entity/entity-parser'

export namespace DateVersionHashParser {
  export function parse(
    dateVersionHash: Entity,
    atlas: Atlas
  ): DateVersionHash {
    if (
      !EntityType.assert<DateVersionHash>(
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
    const text = EntityParser.parse(config, atlas)
    dateVersionHash.children.push(text)
    Entity.invalidateBounds(dateVersionHash)

    return dateVersionHash
  }
}
