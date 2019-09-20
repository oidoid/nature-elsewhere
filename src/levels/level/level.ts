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
import {XY} from '../../math/xy/xy'
import {EntityID} from '../../entities/entity-id/entity-id'
import {Rect} from '../../math/rect/rect'

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

  export function clamp(level: Level, position: XY, size: WH): XY {
    const min = {x: 0, y: 0}
    const max = {
      x: Math.max(0, level.size.w - size.w),
      y: Math.max(0, level.size.h - size.h)
    }
    return XY.clamp(position, min, max)
  }

  export function updateCamera(level: Level): void {
    if (level.cam.followID === EntityID.ANONYMOUS) return

    let follow
    if (level.player && level.player.id === level.cam.followID)
      follow = level.player
    else
      for (const parent of level.parentEntities) {
        follow = EntityUtil.find(parent, level.cam.followID)
        if (follow) break
      }

    if (follow) centerCameraOn(level, follow.bounds)
  }
}

function centerCameraOn(level: Level, on: Rect): void {
  const {x, y} = Level.clamp(
    level,
    Rect.centerOn(level.cam.bounds, on),
    level.cam.bounds
  )
  level.cam.bounds.x = x
  level.cam.bounds.y = y
}
