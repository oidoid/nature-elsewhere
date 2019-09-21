import {Level} from '../../levels/level/Level'
import {InputState} from '../../inputs/InputState'
import {WH} from '../../math/wh/WH'

/** Game tick state to be applied. Cached values for commonly derived values are
    also included for convenience. */
export interface UpdateState {
  /** The duration of time to update state for. */
  readonly time: Milliseconds
  readonly level: Level
  readonly canvasWH: WH
  readonly inputs: Readonly<InputState>
}

export namespace UpdateState {
  export function make(
    time: Milliseconds,
    level: Level,
    canvasWH: WH,
    inputs: InputState
  ): UpdateState {
    return {time, canvasWH, level, inputs}
  }
}
