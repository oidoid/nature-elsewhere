import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'

/** A single image. */
export interface ImageEntity extends Entity {
  readonly type: EntityType.IMAGE
}
