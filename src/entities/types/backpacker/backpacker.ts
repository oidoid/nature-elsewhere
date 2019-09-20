import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'

export interface Backpacker extends Entity {
  readonly type: EntityType.CHAR_BACKPACKER
}

export namespace Backpacker {
  export enum State {
    IDLE_UP = 'idleUp',
    IDLE_RIGHT = 'idleRight',
    IDLE_DOWN = 'idleDown',
    WALK_UP = 'walkUp',
    WALK_RIGHT = 'walkRight',
    WALK_DOWN = 'walkDown'
  }
}
