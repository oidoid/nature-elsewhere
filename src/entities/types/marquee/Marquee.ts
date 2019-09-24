import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

export interface Marquee extends Entity {
  readonly type: EntityType.UI_MARQUEE
  selected?: Symbol
}
