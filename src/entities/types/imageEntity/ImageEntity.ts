import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

/** A single image. */
export interface ImageEntity extends Entity {
  readonly type: EntityType.IMAGE
}
