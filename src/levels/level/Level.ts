import {Atlas} from '../../atlas/Atlas'
import {Backpacker} from '../../entities/types/backpacker/Backpacker'
import {Camera} from '../camera/Camera'
import {Cursor} from '../../entities/types/cursor/Cursor'
import {EntityCollider} from '../../collision/EntityCollider'
import {EntityCollision} from '../../collision/EntityCollision'
import {Entity} from '../../entity/Entity'
import {EntityID} from '../../entity/EntityID'
import {LevelAdvance} from './LevelAdvance'
import {LevelType} from '../levelType/LevelType'
import {Rect} from '../../math/rect/Rect'
import {WH} from '../../math/wh/WH'
import {XY} from '../../math/xy/XY'

export interface Level {
  readonly type: LevelType
  /** Usually LevelType.PAUSE_LEVEL. */
  prevLevel?: LevelType
  nextLevel?: LevelType
  advance: LevelAdvance
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
  export function advance(level: Level, nextLevel: LevelType): void {
    level.nextLevel = nextLevel
    level.advance = LevelAdvance.NEXT
  }

  export function activeParents(level: Level): readonly Entity[] {
    return level.parentEntities.filter(entity =>
      Entity.active(entity, level.cam.bounds)
    )
  }

  export function collisionWithCursor(
    level: Level,
    entity: Entity
  ): Maybe<EntityCollision> {
    const collisionWithCursor = level.cursor
      ? EntityCollider.collidesEntities(level.cursor, activeParents(level))
      : undefined
    if (!collisionWithCursor) return
    if (Entity.equal(collisionWithCursor.rhs.descendant, entity))
      return collisionWithCursor
    return
  }

  export function clamp(
    level: Level,
    position: Readonly<XY>,
    size: Readonly<WH>
  ): XY {
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
        follow = Entity.findByID(parent, level.cam.followID)
        if (follow) break
      }

    if (follow) centerCameraOn(level, follow.bounds)
  }
}

function centerCameraOn(level: Level, on: Rect): void {
  const {x, y} = Level.clamp(
    level,
    Rect.centerOn(level.cam.bounds, on),
    level.cam.bounds.size
  )
  level.cam.bounds.position.x = x
  level.cam.bounds.position.y = y
}
