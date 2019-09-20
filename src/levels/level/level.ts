import {WH} from '../../math/wh/wh'
import {Entity} from '../../entities/entity/entity'
import {LevelType} from '../level-type/level-type'
import {Backpacker} from '../../entities/types/backpacker/backpacker'
import {Cursor} from '../../entities/types/cursor/cursor'
import {Atlas} from '../../atlas/atlas/atlas'
import {Camera} from '../camera/camera'
import {EntityCollider} from '../../collision/entity-collider'
import {EntityCollision} from '../../collision/entity-collision'
import {EntityUtil} from '../../entities/entity/entity-util'

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

  export function activeParents(level: Level): readonly Entity[] {
    return level.parentEntities.filter(entity =>
      EntityUtil.active(entity, level.cam.bounds)
    )
  }

  export function collisionWithCursor(
    level: Level,
    entity: Entity
  ): Maybe<EntityCollision> {
    const collisionWithCursor = level.cursor
      ? EntityCollider.collidesEntities(
          level.cursor,
          Level.activeParents(level)
        )
      : undefined
    if (!collisionWithCursor) return
    if (EntityUtil.equal(collisionWithCursor.rhs.descendant, entity))
      return collisionWithCursor
    return
  }
}
