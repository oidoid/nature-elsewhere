import * as atlas from '../assets/atlas'
import * as entity from './entity'

export function nextStepState(
  state: entity.State,
  step: number,
  _atlas: atlas.State
): void {
  state.position.x += step * state.speed.x
  state.position.y += step * state.speed.y
  state.scrollPosition.x += step * state.scrollSpeed.x
  state.scrollPosition.y += step * state.scrollSpeed.y
}
