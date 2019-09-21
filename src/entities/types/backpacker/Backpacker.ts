import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {EntityState} from '../../entityState/EntityState'
import {BackpackerState} from './BackpackerState'

export interface Backpacker extends Entity {
  readonly type: EntityType.CHAR_BACKPACKER
  state: EntityState | BackpackerState
}
