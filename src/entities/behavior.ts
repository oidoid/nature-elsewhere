import {Entity} from './entity'
import {ImageRect} from '../images/image-rect'
import {InputSource} from '../inputs/input-source'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'
import {InputBit} from '../inputs/input-bit'

export const Behavior = Object.freeze({
  STATIC() {},
  CIRCLE(state: Mutable<Entity>) {
    // posit new xy and if ok
    ;({x: state.x, y: state.y, w: state.w, h: state.h} = ImageRect.moveBy(
      state,
      {x: state.vx, y: state.vy},
      ...state.images
    ))
  },
  BACKPACKER(state: Mutable<Entity>, _cam: Rect, recorder: Recorder): void {
    if (state.id !== 'backpacker')
      throw new Error(`Unsupported ID "${state.id}".`)
    let {x, y} = state
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
    if (up) (y -= s), (state.state = 'walkUp') // rebuild the images i guess
    if (down) (y += s), (state.state = 'walkDown')
    if (left) (x -= s), (state.state = 'walkLeft'), (state.sx = -1)
    if (right)
      (x += s), (state.state = 'walkLeft'), (state.sx = 1)
      // state.images = EntityConfigs[state.state].images
    ;({x: state.x, y: state.y, w: state.w, h: state.h} = ImageRect.moveTo(
      state,
      {x, y},
      ...state.images
    ))
  },
  WRAPAROUND(state: Mutable<Entity>) {
    // posit new xy and if ok
    ;({x: state.x, y: state.y, w: state.w, h: state.h} = ImageRect.moveBy(
      state,
      {x: state.vx, y: state.vy},
      ...state.images
    ))

    // entity.step(entityState, milliseconds, atlas)
    // const min = level.bounds.x - cam.w
    // const max = level.bounds.x + level.bounds.w + cam.w
    // entityState.position.x = util.wrap(entityState.position.x, min, max)
  },
  FOLLOW_CAM(state: Mutable<Entity>, cam: Rect) {
    ;({x: state.x, y: state.y, w: state.w, h: state.h} = ImageRect.moveTo(
      state,
      {x: 1, y: cam.y + cam.h - (state.h + 1)},
      ...state.images
    ))
  },
  CURSOR(state: Mutable<Entity>, _cam: Rect, recorder: Recorder) {
    const [set] = recorder.combo.slice(-1)
    const point = set && set[InputSource.POINTER_POINT]
    if (point)
      ({x: state.x, y: state.y, w: state.w, h: state.h} = ImageRect.moveTo(
        state,
        XY.trunc(point.xy),
        ...state.images
      ))
  }
})

export namespace Behavior {
  export type Key = keyof typeof Behavior
}
