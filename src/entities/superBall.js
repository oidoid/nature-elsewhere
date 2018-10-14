import * as atlas from './atlas.js'
import * as entity from './entity.js'

/**
 * @arg {entity.State} state
 * @arg {number} step
 * @arg {atlas.State} _atlas
 * @return {void}
 */
export function nextStepState(state, step, _atlas) {
  state._position.x += step * state._speed.x
  state._position.y += step * state._speed.y
  state._scrollPosition.x += step * state.scrollSpeed.x
  state._scrollPosition.y += step * state.scrollSpeed.y
}
