import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {InputBit} from '../inputs/input-bit'
import {InputSource} from '../inputs/input-source'
import {Level} from '../levels/level'
import {NumberUtil} from '../math/number-util'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

export const Behavior = Object.freeze({
  STATIC() {},
  CIRCLE(state: Mutable<Entity>) {
    const rect = state.states[state.state]
    state.states[state.state] = ImageRect.moveBy(
      rect,
      {x: state.vx, y: state.vy},
      ...rect.images
    )
  },
  BACKPACKER(
    state: Mutable<Entity>,
    entities: readonly Entity[],
    _level: Level,
    atlas: Atlas,
    _cam: Rect,
    recorder: Recorder
  ): void {
    if (state.id !== 'backpacker')
      throw new Error(`Unsupported ID "${state.id}".`)
    const original = state.states[state.state]
    let rect = state.states[state.state]
    let {x, y} = rect
    const up = Recorder.set(recorder, InputBit.UP)
    const down = Recorder.set(recorder, InputBit.DOWN)
    const left = Recorder.set(recorder, InputBit.LEFT)
    const right = Recorder.set(recorder, InputBit.RIGHT)
    const diagonal = (left || right) && (up || down)
    let s = 0.25
    if (!recorder.timer && diagonal) {
      // Synchronize x and y pixel movement when initially moving diagonally.
      ;({x, y} = XY.trunc({x, y}))

      // One direction is negative, the other is positive. Offset by 1 - speed
      // to synchronize.
      if (left && down) x += 1 - s
      else if (right && up) y += 1 - s
    }

    const [set] = recorder.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]
    if (pick && pick.bits === InputBit.PICK) {
      const dst = XY.trunc(XY.add(pick.xy, {x: -4, y: -rect.h + 2}))
      if (y > dst.y) (y -= s), ((state.state = 'walkUp'), (state.scale.x = 1))
      if (y < dst.y) (y += s), ((state.state = 'walkDown'), (state.scale.x = 1))
      if (x > dst.x) (x -= s), (state.state = 'walkRight'), (state.scale.x = -1)
      if (x < dst.x) (x += s), (state.state = 'walkRight'), (state.scale.x = 1)
      if (x === dst.x && y === dst.y)
        state.state =
          state.state === 'walkUp' || state.state === 'idleUp'
            ? 'idleUp'
            : state.state === 'idleRight' ||
              state.state === 'walkRight' ||
              state.state === 'walkLeft'
            ? 'idleRight'
            : 'idleDown'
    } else {
      state.state =
        state.state === 'walkUp' || state.state === 'idleUp'
          ? 'idleUp'
          : state.state === 'idleRight' ||
            state.state === 'walkRight' ||
            state.state === 'walkLeft'
          ? 'idleRight'
          : 'idleDown'
    }

    let found
    ;({found, rect} = checkCollisionThingy(rect, state, entities, x, y, atlas))
    if (found) ({x, y} = original)
    state.states[state.state] = ImageRect.moveTo(
      rect,
      {x, y},
      ...state.states[state.state].images
    )
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
    state.states[state.state] = ImageRect.moveTo(rect, xy, ...rect.images)
  },
  FOLLOW_CAM(
    state: Mutable<Entity>,
    _entities: readonly Entity[],
    _level: Level,
    _atlas: Atlas,
    cam: Rect
  ) {
    const rect = state.states[state.state]
    state.states[state.state] = ImageRect.moveTo(
      rect,
      {x: 1, y: cam.y + cam.h - (rect.h + 1)},
      ...rect.images
    )
  },
  CURSOR(
    state: Mutable<Entity>,
    _entities: readonly Entity[],
    _level: Level,
    _atlas: Atlas,
    _cam: Rect,
    recorder: Recorder
  ) {
    const [set] = recorder.combo.slice(-1)
    const pick = set && set[InputSource.POINTER_PICK]
    const point = set && set[InputSource.POINTER_POINT]
    if (pick && pick.bits === InputBit.PICK) {
      state.state = 'pick'
      const rect = state.states[state.state]
      state.states[state.state] = ImageRect.moveTo(
        rect,
        pick.xy,
        ...rect.images
      )
    } else {
      state.state = 'point'
      if (point) {
        const rect = state.states[state.state]
        state.states[state.state] = ImageRect.moveTo(
          rect,
          point.xy,
          ...rect.images
        )
      }
    }
  }
})

export namespace Behavior {
  export type Key = keyof typeof Behavior
}
function checkCollisionThingy(
  rect: ImageRect,
  state: Mutable<Entity>,
  entities: readonly Entity[],
  x: number,
  y: number,
  atlas: Readonly<Record<string, Atlas.Animation>>
) {
  rect = state.states[state.state]
  const found = entities.find(
    entity =>
      entity !== state &&
      entity.collides &&
      Rect.intersects(entity.states[entity.state], {...rect, x, y}) &&
      entity.states[entity.state].images.some(img =>
        Image.cel(img, atlas).collision.some(r =>
          rect.images.some(lhsImg =>
            Image.cel(lhsImg, atlas).collision.some(lhsRect =>
              Rect.intersects(r, {
                w: lhsRect.w,
                h: lhsRect.h,
                x: lhsRect.x + x - entity.states[entity.state].x,
                y: lhsRect.y + y - entity.states[entity.state].y
              })
            )
          )
        )
      )
  )
  return {found, rect}
}
