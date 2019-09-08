import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {ImageRect} from '../images/image-rect'
import {InputBit} from '../inputs/input-bit'
import {InputSource} from '../inputs/input-source'
import {Level} from '../levels/level'
import {NumberUtil} from '../math/number-util'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'
import {RectArray} from '../math/rect-array'

export const Behavior = Object.freeze({
  STATIC() {},
  CIRCLE(state: Mutable<Entity>) {
    const rect = state.states[state.state]
    state.states[state.state] = ImageRect.moveBy(rect, {
      x: state.vx,
      y: state.vy
    })
  },
  BACKPACKER(
    state: Mutable<Entity>,
    entities: readonly Entity[],
    level: Level,
    _atlas: Atlas,
    _cam: Rect,
    _recorder: Recorder
  ): void {
    if (state.id !== 'backpacker')
      throw new Error(`Unsupported ID "${state.id}".`)
    let rect = state.states[state.state]
    let {x, y} = rect

    const pick = (<any>state).dst
    const dst = pick ? XY.trunc(XY.add(pick, {x: -4, y: -rect.h + 2})) : rect
    const left = dst.x < Math.trunc(x)
    const right = dst.x > Math.trunc(x)
    const up = dst.y < Math.trunc(y)
    const down = dst.y > Math.trunc(y)
    const diagonal = (left || right) && (up || down)
    const animateHorizontal = Math.abs(x - dst.x) > 8
    const hypotenuse = 0.18
    let s = diagonal ? hypotenuse : Math.sqrt(hypotenuse * hypotenuse * 2)

    if (pick) {
      if (up) (y -= s), (state.state = 'walkUp'), (state.scale.x = 1)
      if (down) (y += s), (state.state = 'walkDown'), (state.scale.x = 1)
      if (left) x -= s
      if (left && animateHorizontal)
        (state.state = 'walkRight'), (state.scale.x = -1)
      if (right) x += s
      if (right && animateHorizontal)
        (state.state = 'walkRight'), (state.scale.x = 1)
    }

    const collision = collides(state, XY.trunc({x, y}), level, entities)
      ? {x: true, y: true}
      : {x: false, y: false}
    if (diagonal && collision.x && collision.y) {
      collision.x = collides(
        state,
        {x: Math.trunc(x), y: Math.trunc(rect.y)},
        level,
        entities
      )
      if (collision.x)
        collision.y = collides(
          state,
          {x: Math.trunc(rect.x), y: Math.trunc(y)},
          level,
          entities
        )
    }
    if (collision.x) x = rect.x
    if (collision.y) y = rect.y

    if (!collision.x && !collision.y) {
      // Synchronize x and y pixel diagonal movement.
      if ((left && up) || (right && down)) y = Math.trunc(y) + (x % 1)
      // One direction is negative, the other is positive. Offset by 1 - speed
      // to synchronize.
      if ((left && down) || (right && up)) y = Math.trunc(y) + (1 - (x % 1))
    }

    const idle =
      !pick ||
      (Math.trunc(x) === dst.x && Math.trunc(y) === dst.y) ||
      (collision.x && collision.y)

    if (idle) {
      state.state =
        state.state === 'walkUp' || state.state === 'idleUp'
          ? 'idleUp'
          : state.state === 'idleRight' ||
            state.state === 'walkRight' ||
            state.state === 'walkLeft'
          ? 'idleRight'
          : 'idleDown'
      const destination = entities.find(({id}) => id === 'destination')
      if (destination) (<any>destination).state = 'hidden'
      delete (<any>state).dst
    }
    rect = state.states[state.state]
    state.states[state.state] = ImageRect.moveTo(state.states[state.state], {
      x,
      y
    })
  },
  FOLLOW_PLAYER(
    _state: Mutable<Entity>,
    entities: readonly Entity[],
    level: Level,
    _atlas: Atlas,
    cam: Mutable<Rect>
  ) {
    const player = entities.find(({id}) => id === 'backpacker')
    if (player) {
      const rect = player.states[player.state]
      cam.x = NumberUtil.clamp(
        Math.trunc(rect.x) + Math.trunc(rect.w / 2) - Math.trunc(cam.w / 2),
        0,
        Math.max(0, level.w - cam.w)
      )
      cam.y = NumberUtil.clamp(
        Math.trunc(rect.y) + Math.trunc(rect.h / 2) - Math.trunc(cam.h / 2),
        0,
        Math.max(0, level.h - cam.h)
      )
    }
  },
  WRAPAROUND(
    state: Mutable<Entity>,
    _entities: readonly Entity[],
    level: Level
  ) {
    const rect = state.states[state.state]
    const xy = {
      x: NumberUtil.wrap(rect.x + state.vx, -rect.w, level.w),
      y: NumberUtil.wrap(rect.y + state.vy, -rect.h, level.h)
    }
    state.states[state.state] = ImageRect.moveTo(rect, xy)
  },
  FOLLOW_CAM(
    state: Mutable<Entity>,
    _entities: readonly Entity[],
    _level: Level,
    _atlas: Atlas,
    cam: Rect
  ) {
    const rect = state.states[state.state]
    state.states[state.state] = ImageRect.moveTo(rect, {
      x: 1,
      y: cam.y + cam.h - (rect.h + 1)
    })
  },
  CURSOR(
    state: Mutable<Entity>,
    entities: readonly Entity[],
    _level: Level,
    _atlas: Atlas,
    _cam: Rect,
    recorder: Recorder
  ) {
    const [set] = recorder.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]
    const point = set && set[InputSource.POINTER_POINT]
    const xy =
      pick && pick.bits === InputBit.PICK
        ? pick.xy
        : point
        ? point.xy
        : undefined

    const rect = state.states[state.state]
    if (xy) state.states[state.state] = ImageRect.moveTo(rect, xy)

    if (pick && pick.bits === InputBit.PICK) {
      const player = entities.find(({id}) => id === 'backpacker')
      if (player) (<any>player).dst = xy
    }
  },
  DESTINATION(
    state: Mutable<Entity>,
    _entities: readonly Entity[],
    _level: Level,
    _atlas: Atlas,
    _cam: Rect,
    recorder: Recorder
  ) {
    const [set] = recorder.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]
    if (pick && pick.bits === InputBit.PICK) {
      state.state = 'visible'
      state.states[state.state].images.forEach(
        img => (((<any>img).exposure = 0), ((<any>img).period = 0))
      )
      state.states[state.state] = ImageRect.moveTo(
        state.states[state.state],
        pick.xy
      )
    }
  }
})

export namespace Behavior {
  export type Key = keyof typeof Behavior
}

const collides = (
  entity: Entity,
  xy: XY, // Overrides entity.xy
  level: Level,
  entities: readonly Entity[]
): boolean => {
  const plane = {
    x: xy.x,
    y: xy.y,
    w: entity.states[entity.state].w,
    h: entity.states[entity.state].h
  } // it seems unideal that i have to go to the image state for this if collision data is moving up. can i move collision data into the staete?
  const levelRect = {x: 0, y: 0, w: level.w, h: level.h}
  if (!Rect.within(plane, levelRect)) return true
  const rectArray = RectArray.moveBy(entity.collisions, xy)
  return !!entities.find(val => {
    if (val === entity) return
    if (!Rect.intersects(plane, val.states[val.state])) return
    const other = RectArray.moveBy(val.collisions, val.states[val.state])
    return RectArray.intersects(rectArray, other)
  })
}
