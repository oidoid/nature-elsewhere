import {Entity} from './entity'
import {ImageRect} from '../images/image-rect'
import {InputSource} from '../inputs/input-source'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

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
    const [set] = recorder.combo
    const point =
      set && (set[InputSource.MOUSE_POINT] || set[InputSource.MOUSE_PICK])
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
