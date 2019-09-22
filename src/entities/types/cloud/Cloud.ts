import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

export interface Cloud extends Entity {
  readonly type: EntityType.SCENERY_CLOUD
}
