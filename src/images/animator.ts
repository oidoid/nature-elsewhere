import * as number from '../math/number'
import {
  AtlasAnimation,
  AtlasAnimationDirection,
  AtlasCel
} from './atlas-definition'

export class Animator {
  constructor(
    /** Cel index oscillation state. This integer may fall out of animation
        bounds. */
    private _period = 0,
    /** Cel exposure in milliseconds. */
    private _duration = 0
  ) {}

  // todo: can state be replaced by passing in total time? I would have to walk
  //       the loop a lot more.
  step(milliseconds: number, animation: AtlasAnimation): void {
    if (animation.cels.length < 2) return

    this._duration += milliseconds % animation.duration
    while (this._duration >= this.cel(animation).duration) {
      this._duration -= this.cel(animation).duration
      this._period = Animate[animation.direction](
        this._period,
        animation.cels.length
      )
    }
  }

  cel(animation: AtlasAnimation): AtlasCel {
    return animation.cels[this.celIndex(animation)]
  }

  celIndex(animation: AtlasAnimation): number {
    return Math.abs(this._period % animation.cels.length)
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
