import {Input} from './Input'

export interface InputState {
  point?: Input
  pick?: Input
}

export namespace InputState {
  export function update(state: InputState, time: Milliseconds): void {
    if (state.point) state.point = Input.update(state.point, time)
    if (state.pick) state.pick = Input.update(state.pick, time)
  }

  export function anyActive(state: InputState): boolean {
    return (
      (state.point && state.point.active) ||
      (state.pick && state.pick.active) ||
      false
    )
  }
}
