import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {EntityState} from '../../entityState/EntityState'
import {CursorState} from './CursorState'

export interface Cursor extends Entity {
  readonly type: EntityType.UI_CURSOR
  state: EntityState | CursorState
}
