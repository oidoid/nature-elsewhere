import {Level} from './Level'
import {LevelType} from '../levelType/LevelType'
import {LevelAdvance} from './LevelAdvance'
import {Entity} from '../../entities/entity/Entity'
import {EntityCollision} from '../../collision/EntityCollision'
import {EntityCollider} from '../../collision/EntityCollider'
import {EntityUtil} from '../../entities/entity/EntityUtil'
import {WH} from '../../math/wh/WH'
import {XY} from '../../math/xy/XY'
import {EntityID} from '../../entities/entityID/EntityID'
import {Rect} from '../../math/rect/Rect'

export namespace LevelUtil {
  export function advance(level: Level, nextLevel: LevelType): void {
    level.nextLevel = nextLevel
    level.advance = LevelAdvance.NEXT
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
      ? EntityCollider.collidesEntities(level.cursor, activeParents(level))
      : undefined
    if (!collisionWithCursor) return
    if (EntityUtil.equal(collisionWithCursor.rhs.descendant, entity))
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
        follow = EntityUtil.find(parent, level.cam.followID)
        if (follow) break
      }

    if (follow) centerCameraOn(level, follow.bounds)
  }
}

function centerCameraOn(level: Level, on: Rect): void {
  const {x, y} = LevelUtil.clamp(
    level,
    Rect.centerOn(level.cam.bounds, on),
    level.cam.bounds.size
  )
  level.cam.bounds.position.x = x
  level.cam.bounds.position.y = y
}
