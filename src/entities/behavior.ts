import {Entity} from './entity'
import {ImageRect} from '../images/image-rect'
import {Rect} from '../math/rect'

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
  }
})

export namespace Behavior {
  export type Key = keyof typeof Behavior
}
