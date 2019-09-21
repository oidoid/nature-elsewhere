import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {EntityState} from '../../entity-state/entity-state'
import {CloudState} from './cloud-state'

export interface Cloud extends Entity {
  readonly type: EntityType.SCENERY_CLOUD
  state: EntityState | CloudState
}
