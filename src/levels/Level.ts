import {Atlas} from 'aseprite-atlas'
import {Backpacker} from '../entities/Backpacker'
import {Camera} from './Camera'
import {Cursor} from '../entities/Cursor'
import {EntityCollider} from '../collision/EntityCollider'
import {Entity} from '../entity/Entity'
import {EntityID} from '../entity/EntityID'
import {LevelAdvance} from './LevelAdvance'
import {LevelType} from './LevelType'
import {Rect, ReadonlyRect} from '../math/Rect'
import {WH} from '../math/WH'
import {XY, FloatXY} from '../math/XY'
import {UpdateState} from '../updaters/UpdateState'
import {Marquee} from '../entities/Marquee'
import {Plane} from '../entities/Plane'

export interface Level {
  readonly type: LevelType
  prevLevel?: Level
  nextLevel?: LevelType
  advance: LevelAdvance
  readonly size: WH
  readonly minViewport: WH
  readonly cam: Camera
  readonly planes: Plane[]
  readonly cursor: Cursor
  readonly destination?: Entity
  readonly hud: Entity[]
  readonly player?: Backpacker
  /** Planes, cursor, destination, HUD, and player are not included in
      parentEntities. */
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
      ...level.parentEntities.filter(entity => entity.active(level.cam.bounds))
    )
    return entities
  }

  export function activeParentsWithPlayer(level: Level): readonly Entity[] {
    const entities = []
    if (level.player) entities.push(level.player)
    entities.push(
      ...level.parentEntities.filter(entity => entity.active(level.cam.bounds)),
      ...level.hud
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
    const {x, y} = FloatXY.clamp(position, min, max)
    return new XY(x, y)
  }

  export function fclamp(
    level: Level,
    position: Readonly<XY | FloatXY>,
    size: Readonly<WH>
  ): FloatXY {
    const min = new XY(0, 0)
    const max = new XY(
      Math.max(0, level.size.w - size.w),
      Math.max(0, level.size.h - size.h)
    )
    return FloatXY.clamp(position, min, max)
  }

  export function updateCamera(state: UpdateState): void {
    if (state.level.cam.followID === EntityID.ANONYMOUS) {
      const {pick} = state.inputs
      if (!pick || !pick.active) return
      const ratio = 0.7
      const cameraDeadZone = {
        position: XY.trunc(
          state.level.cam.bounds.position.x +
            (state.level.cam.bounds.size.w * (1 - ratio)) / 2,
          state.level.cam.bounds.position.y +
            Math.trunc((state.level.cam.bounds.size.h * (1 - ratio)) / 2)
        ),
        size: new WH(
          Math.trunc(state.level.cam.bounds.size.w * ratio),
          Math.trunc(state.level.cam.bounds.size.h * ratio)
        )
      }
      if (Rect.intersects(cameraDeadZone, state.level.cursor.bounds)) return
      const marquee = <Maybe<Marquee>>(
        Entity.findAnyByID(state.level.parentEntities, EntityID.UI_MARQUEE)
      )
      const hudCollision = EntityCollider.collidesEntities(
        state.level.cursor,
        state.level.hud
      ).length
      const marqueeCollision =
        marquee &&
        marquee.selection &&
        state.level.cursor.collidesRect(marquee.bounds).length
      if (hudCollision && !marqueeCollision) return
      const destination = Level.fclamp(
        state.level,
        FloatXY.lerp(
          state.level.cam.fposition,
          state.level.cursor.bounds.position.sub(
            XY.trunc(
              state.level.cam.bounds.size.w / 2,
              state.level.cam.bounds.size.h / 2
            )
          ),
          0.01
        ),
        state.level.cam.bounds.size
      )
      state.level.cam.moveTo(destination)
      return
    }

    let follow
    if (
      state.level.player &&
      state.level.player.id === state.level.cam.followID
    )
      follow = state.level.player
    else
      for (const parent of state.level.parentEntities) {
        follow = parent.findByID(state.level.cam.followID)
        if (follow) break
      }

    if (follow) centerCameraOn(state.level, follow.bounds)
  }
}

function centerCameraOn(level: Level, on: ReadonlyRect): void {
  const destination = Level.clamp(
    level,
    Rect.centerOn(level.cam.bounds, on),
    level.cam.bounds.size
  )
  level.cam.moveTo(destination)
}
