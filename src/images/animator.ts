import {Atlas} from './atlas'
import {NumberUtil} from '../utils/number-util'

// Animates AtlasAnimations by providing the correct cel for a given time.
export class Animator {
  constructor(
    private readonly _animation: Atlas.Animation,
    /** Cel index oscillation state. This integer may fall out of animation
        bounds. */
    private _period: number = 0,
    /** Cel exposure in milliseconds. */
    private _duration: number = 0
  ) {
    if (this._animation.cels.length < 2) this.step = () => {}
  }

  step(milliseconds: number): void {
    // The next frame is a function of the current cel exposure (_duration),
    // the time since the last step measured (milliseconds), and the current
    // frame index within the animation interval (_period).
    this._duration += milliseconds % this._animation.duration
    while (this._duration >= this.cel().duration) {
      this._duration -= this.cel().duration
      this._period = Animate[this._animation.direction](
        this._period,
        this._animation.cels.length
      )
    }
  }

  cel(): Atlas.Cel {
    return this._animation.cels[this.celIndex()]
  }

  celIndex(): number {
    return Math.abs(this._period % this._animation.cels.length)
  }
}

const Animate: Readonly<
  Record<Atlas.AnimationDirection, (period: number, length: number) => number>
> = Object.freeze({
  /** @arg period An integer in the domain [0, +∞). */
  [Atlas.AnimationDirection.FORWARD](period: number) {
    return (period % Number.MAX_SAFE_INTEGER) + 1
  },
  /** @arg period An integer in the domain (-∞, length - 1]. */
  [Atlas.AnimationDirection.REVERSE](period: number, length: number) {
    return (period % Number.MIN_SAFE_INTEGER) - 1 + length
  },
  /** @arg period An integer in the domain [2 - length, length - 1]. */
  [Atlas.AnimationDirection.PING_PONG](period: number, length: number) {
    return NumberUtil.wrap(period - 1, 2 - length, length)
  }
})
