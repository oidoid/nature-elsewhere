import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

export interface Backpacker extends Entity {
  readonly type: EntityType.CHAR_BACKPACKER
}
