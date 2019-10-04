import {Atlas} from 'aseprite-atlas'
import {Text} from './text/Text'
import {Build} from '../../utils/Build'
import {EntityType} from '../../entity/EntityType'

export class DateVersionHash extends Text {
  constructor(atlas: Atlas, props?: Text.Props) {
    super(atlas, {
      type: EntityType.UI_DATE_VERSION_HASH,
      text: `${Build.date} v${Build.version} ${Build.hash}`,
      ...props
    })
  }
}
