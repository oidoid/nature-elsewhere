import {Atlas} from 'aseprite-atlas'
import {Backpacker} from '../entities/types/backpacker/Backpacker'
import {Camera} from './Camera'
import {Cursor} from '../entities/types/cursor/Cursor'
import {EntityCollider} from '../collision/EntityCollider'
import {Entity} from '../entity/Entity'
import {EntityID} from '../entity/EntityID'
import {LevelAdvance} from './LevelAdvance'
import {LevelType} from './LevelType'
import {Rect} from '../math/Rect'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

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

  export function activeParentsNoPlayer(level: Level): readonly Entity[] {
    const entities = []
    entities.push(
      ...level.parentEntities.filter(entity =>
        Entity.active(entity, level.cam.bounds)
      )
    )
    return entities
  }

  export function activeParentsWithPlayer(level: Level): readonly Entity[] {
    const entities = []
    if (level.player) entities.push(level.player)
    entities.push(
      ...level.parentEntities.filter(entity =>
        Entity.active(entity, level.cam.bounds)
      )
    )
    return entities
  }

  export function collisionWithCursor(level: Level, entity: Entity): boolean {
    const collidesWith = level.cursor
      ? EntityCollider.collidesEntities(
          level.cursor,
          activeParentsWithPlayer(level)
        )
      : []
    return !!Entity.findAnyBySpawnID(collidesWith, entity.spawnID)
  }

  export function clamp(
    level: Level,
    position: Readonly<XY>,
    size: Readonly<WH>
  ): XY {
    const min = new XY(0, 0)
    const max = new XY(
      Math.max(0, level.size.w - size.w),
      Math.max(0, level.size.h - size.h)
    )
    return position.clamp(min, max)
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
