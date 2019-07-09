import {Atlas} from './atlas'
import {NumberUtil} from '../math/number-util'

// Animates Atlas.Animations by providing the correct cel for a given time.
export class Animator {
  constructor(
    private readonly animation: Atlas.Animation,
    /** Cel index oscillation state. This integer may fall out of animation
        bounds. */
    private period: number = 0,
    /** Cel exposure in milliseconds. */
    private duration: number = 0
  ) {
    if (this.animation.cels.length < 2) this.step = () => {}
  }

  step(milliseconds: number): void {
    // The next frame is a function of the current cel exposure (duration), the
    // time since the last step measured (milliseconds), and the current frame
    // index within the animation interval (period).
    this.duration = (this.duration + milliseconds) % this.animation.duration
    while (this.duration >= this.cel().duration) {
      this.duration -= this.cel().duration
      const period = Period[this.animation.direction]
      this.period = period(this.period, this.animation.cels.length)
    }
  }

  cel(): Atlas.Cel {
    return this.animation.cels[this.index()]
  }

  index(): number {
    return Math.abs(this.period % this.animation.cels.length)
  }
}

const Period: Readonly<
  Record<Atlas.AnimationDirection, (period: number, length: number) => number>
> = Object.freeze({
  /** @arg period An integer in the domain [0, +∞). */
  [Atlas.AnimationDirection.FORWARD](period) {
    return (period % Number.MAX_SAFE_INTEGER) + 1
  },
  /** @arg period An integer in the domain (-∞, length - 1]. */
  [Atlas.AnimationDirection.REVERSE](period, length) {
    return (period % Number.MIN_SAFE_INTEGER) - 1 + length
  },
  /** @arg period An integer in the domain [2 - length, length - 1]. */
  [Atlas.AnimationDirection.PING_PONG](period, length) {
    return NumberUtil.wrap(period - 1, 2 - length, length)
  }
})
