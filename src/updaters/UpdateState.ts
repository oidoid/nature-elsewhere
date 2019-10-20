import {Level} from '../levels/Level'
import {InputState} from '../inputs/InputState'
import {Milliseconds} from 'aseprite-atlas'
import {WH} from '../math/WH'

/** Game tick state to be applied. Cached values for commonly derived values are
    also included for convenience. */
export interface UpdateState {
  readonly win: Window
  /** The duration of time to update state for. */
  readonly time: Milliseconds
  readonly level: Level
  readonly canvasSize: Readonly<WH>
  readonly inputs: Readonly<InputState>
}

export namespace UpdateState {
  export function make(
    win: Window,
    time: Milliseconds,
    level: Level,
    canvasSize: WH,
    inputs: InputState
  ): UpdateState {
    return {win, time, canvasSize, level, inputs}
  }
}
