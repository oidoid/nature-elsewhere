import {FloatXY} from '../math/FloatXY'
import {Milliseconds} from 'aseprite-atlas'
import {ReadonlyRect} from '../math/Rect'
import {Viewport} from '../renderer/Viewport'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export interface Input {
  /** True if input is on. */
  readonly active: boolean
  /** 0 on state change. When 0 and active, triggered on. When 0 and inactive,
      triggered off. */
  readonly timer: Milliseconds
  /** The position of the input in window coordinates. Pointer state polling is
      simulated through events so level position must be recalculated through
      the camera lens of each frame. */
  readonly windowPosition: FloatXY
}

export namespace Input {
  export function activeTriggered(input: Maybe<Input>): boolean {
    return !!(input?.active && !input.timer)
  }

  export function activeLong(input: Maybe<Input>): boolean {
    return !!(input?.active && input.timer > 500)
  }

  export function inactiveTriggered(input: Maybe<Input>): boolean {
    return !input?.active && !input?.timer
  }

  export function levelXY(
    input: Input,
    canvasWH: Readonly<WH>,
    cam: ReadonlyRect
  ): XY {
    return Viewport.toLevelXY(input.windowPosition, canvasWH, cam)
  }

  export function update(input: Input, time: Milliseconds): Input {
    const {active, timer, windowPosition} = input
    return {active, timer: timer + time, windowPosition}
  }
}
