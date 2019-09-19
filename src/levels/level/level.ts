import {WH} from '../../math/wh/wh'
import {Entity} from '../../entities/entity/entity'
import {LevelType} from '../level-type/level-type'
import {Backpacker} from '../../entities/types/backpacker/backpacker'
import {Cursor} from '../../entities/types/cursor/cursor'
import {Atlas} from '../../atlas/atlas/atlas'
import {Camera} from '../camera/camera'

export interface Level {
  readonly type: LevelType
  /** Usually LevelType.PAUSE_LEVEL. */
  prevLevel?: LevelType
  nextLevel?: LevelType
  advance: Level.Advance
  readonly size: WH
  readonly minViewport: WH
  readonly cam: Camera
  readonly cursor: Cursor
  readonly player: Maybe<Backpacker>
  readonly destination: Maybe<Entity>
  /** Cursor and player are not included in parentEntities. */
  readonly parentEntities: Entity[]
  readonly atlas: Atlas
}

export namespace Level {
  export enum Advance {
    UNCHANGED = 'unchanged',
    PREV = 'prev',
    NEXT = 'next'
  }

  export function advance(level: Level, nextLevel: LevelType): void {
    level.nextLevel = nextLevel
    level.advance = Advance.NEXT
  }
}
