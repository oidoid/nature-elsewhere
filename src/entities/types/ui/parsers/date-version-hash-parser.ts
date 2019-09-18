import {Entity} from '../../../entity'
import {EntityType} from '../../entity-type'
import {DateVersionHash} from '../date-version-hash'
import {Build} from '../../../../utils/build'
import {TextParser} from './text-parser'
import {Atlas} from '../../../../atlas/atlas/atlas'
import {Text} from '../text'

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
    dateVersionHash.text = `${date} v${version} (${hash})`
    const text: Text = TextParser.parse(
      {...dateVersionHash, type: EntityType.UI_TEXT},
      atlas
    )
    return {...text, type: EntityType.UI_DATE_VERSION_HASH}
  }
}
