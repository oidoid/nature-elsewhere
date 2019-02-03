import * as number from '../math/number'
import {
  AtlasAnimation,
  AtlasAnimationDirection,
  AtlasCel
} from './atlas-definition'

// Animates AtlasAnimations by providing the correct cel for a given time.
export class Animator {
  constructor(
    private readonly _animation: AtlasAnimation,
    /** Cel index oscillation state. This integer may fall out of animation
        bounds. */
    private _period: number = 0,
    /** Cel exposure in milliseconds. */
    private _duration: number = 0
  ) {
    if (this._animation.cels.length < 2) this.step = () => {}
  }

  // todo: can state be replaced by passing in total time? I would have to walk
  //       the loop a lot more but it would drop a lot of state and potential
  //       bugs. A class is the right choice here if mutating state is needed.
  step(milliseconds: number): void {
    this._duration += milliseconds % this._animation.duration
    while (this._duration >= this.cel().duration) {
      this._duration -= this.cel().duration
      this._period = Animate[this._animation.direction](
        this._period,
        this._animation.cels.length
      )
    }
  }

  cel(): AtlasCel {
    return this._animation.cels[this.celIndex()]
  }

  celIndex(): number {
    return Math.abs(this._period % this._animation.cels.length)
  }
}

const Animate: Readonly<
  Record<AtlasAnimationDirection, (period: number, length: number) => number>
> = {
  /** @arg period An integer in the domain [0, +∞). */
  [AtlasAnimationDirection.FORWARD](period) {
    return (period % Number.MAX_SAFE_INTEGER) + 1
  },
  /** @arg period An integer in the domain (-∞, length - 1]. */
  [AtlasAnimationDirection.REVERSE](period, length) {
    return (period % Number.MIN_SAFE_INTEGER) - 1 + length
  },
  /** @arg period An integer in the domain [2 - length, length - 1]. */
  [AtlasAnimationDirection.PING_PONG](period, length) {
    return number.wrap(period - 1, 2 - length, length)
  }
}
