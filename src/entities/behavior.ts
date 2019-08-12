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
    const point = set && set[InputSource.MOUSE_POINT]
    if (point)
      ({x: state.x, y: state.y, w: state.w, h: state.h} = ImageRect.moveTo(
        state,
        XY.trunc(point.xy),
        ...state.images
      ))
  },
  VIRTUAL_JOYSTICK(
    state: Mutable<Entity>,
    _cam: Rect,
    recorder: Recorder,
    time: number
  ) {
    ;(<any>state).timer += time
    const [set] = recorder.combo.slice(-1)
    const position = set && set[InputSource.VIRTUAL_GAMEPAD_JOYSTICK_POSITION]
    if (
      position &&
      Recorder.triggeredSet(recorder, InputBit.POSITION_VIRTUAL_JOYSTICK)
    ) {
      ;({x: state.x, y: state.y, w: state.w, h: state.h} = ImageRect.moveTo(
        state,
        XY.trunc(XY.sub(position.xy, {x: state.w / 2, y: state.h / 2})),
        ...state.images
      ))
      ;(<any>state).timer = 0
    }

    const joystick = set && set[InputSource.VIRTUAL_GAMEPAD_JOYSTICK_AXES]
    let target = {x: 0, y: 0}
    if (joystick) {
      const radius = Math.min(state.w / 2, joystick.magnitude)
      target = XY.trunc(XY.mul(joystick.normal, radius))
      ;(<any>state).timer = 0
    }
    ;(<any>state).stick.x = state.x + target.x
    ;(<any>state).stick.y = state.y + target.y
  }
})

export namespace Behavior {
  export type Key = keyof typeof Behavior
}
