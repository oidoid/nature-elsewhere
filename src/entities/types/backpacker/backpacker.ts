import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {EntityState} from '../../entity-state/entity-state'
import {BackpackerState} from './backpacker-state'

export interface Backpacker extends Entity {
  readonly type: EntityType.CHAR_BACKPACKER
  state: EntityState | BackpackerState
}
