import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {EntityState} from '../../entity-state/entity-state'

export interface Cursor extends Entity {
  readonly type: EntityType.UI_CURSOR
  state: EntityState | Cursor.State
}

export namespace Cursor {
  export enum State {
    VISIBLE = 'visible'
  }
}
