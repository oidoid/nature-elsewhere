import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {EntityState} from '../../entityState/EntityState'
import {CloudState} from './CloudState'

export interface Cloud extends Entity {
  readonly type: EntityType.SCENERY_CLOUD
  state: EntityState | CloudState
}
