import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entity/EntityType'

/** A single image. */
export interface ImageEntity extends Entity {
  readonly type: EntityType.IMAGE
}
