import {Atlas} from '../atlas/atlas'
import {NumberUtil} from '../math/number-util'

export interface Animator {
  /** Cel index oscillation state. This integer may fall outside of animation
      bounds depending on the animation interval selected by direction. This
      value should be carried over from each call unless the cel is manually
      set. Any integer in [0, len - 1] is always valid. */
  readonly period: number

  /** Current cel exposure in milliseconds. When the value meets or exceeds the
      cel's exposure duration, the cel is advanced according to direction. This
      value should be carried over from each call with the current time step
      added, and zeroed on manual cel change. */
  readonly exposure: number
}
type t = Animator

export namespace Animator {
  export const animate = (
    {cels, direction, duration}: Atlas.Animation,
    period: number,
    exposure: number
  ): t => {
    exposure = exposure % duration
    while (exposure >= cels[index(cels, period)].duration) {
      exposure -= cels[index(cels, period)].duration
      period = Period[direction](period, cels.length)
    }
    return {period, exposure}
  }

  export const index = (cels: readonly Atlas.Cel[], period: number): number =>
    Math.abs(period % cels.length)
}

const Period: Readonly<
  Record<Atlas.AnimationDirection, (period: number, len: number) => number>
> = Object.freeze({
  /** @arg period An integer in the domain [0, +∞). */
  [Atlas.AnimationDirection.FORWARD]: period =>
    (period % Number.MAX_SAFE_INTEGER) + 1,
  /** @arg period An integer in the domain (-∞, len - 1]. */
  [Atlas.AnimationDirection.REVERSE]: (period, len) =>
    (period % Number.MIN_SAFE_INTEGER) - 1 + len,
  /** @arg period An integer in the domain [2 - len, len - 1]. */
  [Atlas.AnimationDirection.PING_PONG]: (period, len) =>
    NumberUtil.wrap(period - 1, 2 - len, len)
})
