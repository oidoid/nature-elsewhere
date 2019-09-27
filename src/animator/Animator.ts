import {Atlas} from '../atlas/Atlas'
import {NumberUtil} from '../math/NumberUtil'

/** Record and update an Image's Atlas.Animation's state. */
export interface Animator {
  /** Cel index oscillation state. This integer may fall outside of animation
      bounds depending on the animation interval selected by direction. This
      value should be carried over from each call unless the cel is manually
      set. Any integer in [0, len - 1] is always valid. */
  period: number

  /** Current cel exposure in milliseconds. When the value meets or exceeds the
      cel's exposure duration, the cel is advanced according to direction. This
      value should be carried over from each call with the current time step
      added, and zeroed on manual cel change. */
  exposure: Milliseconds
}

export namespace Animator {
  export function animate(
    period: number,
    exposure: Milliseconds,
    animation: Atlas.Animation
  ): Animator {
    // animation.duration may be infinite but the modulo of any number and
    // infinity is that number.
    exposure = exposure % animation.duration
    while (exposure >= animation.cels[index(period, animation.cels)].duration) {
      exposure -= animation.cels[index(period, animation.cels)].duration
      period = Period[animation.direction](period, animation.cels.length)
    }
    return {period, exposure}
  }

  export function index(period: number, cels: readonly Atlas.Cel[]): number {
    return Math.abs(period % cels.length)
  }
}

const Period: Readonly<
  Record<Atlas.AnimationDirection, (period: number, len: number) => number>
> = Object.freeze({
  /** @arg period An integer in the domain [0, +∞). */
  [Atlas.AnimationDirection.FORWARD](period) {
    return (period % Number.MAX_SAFE_INTEGER) + 1
  },

  /** @arg period An integer in the domain (-∞, len - 1]. */
  [Atlas.AnimationDirection.REVERSE](period, len) {
    return (period % Number.MIN_SAFE_INTEGER) - 1 + len
  },

  /** @arg period An integer in the domain [2 - len, len - 1]. */
  [Atlas.AnimationDirection.PING_PONG](period, len) {
    return NumberUtil.wrap(period - 1, 2 - len, len)
  }
})
