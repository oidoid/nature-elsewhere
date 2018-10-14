import * as atlas from './atlas.js'
import * as entity from './entity.js'

/**
 * @arg {entity.State} state
 * @arg {number} step
 * @arg {atlas.State} _atlas
 * @return {void}
 */
export function nextStepState(state, step, _atlas) {
  state.position.x += step * state.speed.x
  state.position.y += step * state.speed.y
  state.scrollPosition.x += step * state.scrollSpeed.x
  state.scrollPosition.y += step * state.scrollSpeed.y
}
