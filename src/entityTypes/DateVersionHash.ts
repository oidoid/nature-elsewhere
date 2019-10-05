import {Atlas} from 'aseprite-atlas'
import {Text} from './text/Text'
import {Build} from '../utils/Build'
import {EntityType} from '../entity/EntityType'
import {Entity} from '../entity/Entity'

export class DateVersionHash extends Entity {
  constructor(atlas: Atlas, props?: Text.Props) {
    super({
      type: EntityType.UI_DATE_VERSION_HASH,
      children: [
        new Text(atlas, {
          type: EntityType.UI_DATE_VERSION_HASH,
          text: `${Build.date} v${Build.version} ${Build.hash}`
        })
      ],
      ...props
    })
  }
}
