import * as atlas from './atlas.js'

/**
 * @type {Readonly<
 *   Record<atlas.AnimationDirection, (cel: number, length: number) => number>
 * >}
 */
const Advance = {
  [atlas.AnimationDirection.FORWARD](cel) {
    return cel + 1
  },
  [atlas.AnimationDirection.REVERSE](cel, length) {
    return cel - 1 + length
  },
  [atlas.AnimationDirection.PING_PONG](cel, length) {
    return ((cel - 1 - (length - 1)) % (2 * (length - 1))) + (length - 1)
  }
}

export class Animator {
  /**
   * @arg {atlas.Animation} animation
   * @arg {number} [cel]
   * @arg {number} [celTime]
   */
  constructor(animation, cel = 0, celTime = 0) {
    /** @type {atlas.Animation} */ this._animation = animation
    /** @type {number} */ this._period = cel
    /** @type {number} Cel exposure in milliseconds. */ this._celTime = celTime
  }

  /** @return {atlas.Animation} */
  getAnimation() {
    return this._animation
  }

  /** @return {Rect} */
  getBounds() {
    return this._animation.cels[this._cel()].bounds
  }

  /**
   * @arg {number} step
   * @return {void}
   */
  step(step) {
    if (this._animation.cels.length === 0) return

    const time = this._celTime + step
    const duration = this._animation.cels[this._cel()].duration
    if (time < duration) {
      this._celTime = time
    } else {
      this._celTime = time - duration
      this._advance()
    }
  }

  /** @return {number} */
  _cel() {
    return Math.abs(this._period % this._animation.cels.length)
  }

  /** @return {void} */
  _advance() {
    const advance = Advance[this._animation.direction]
    const msg = `Unknown AnimationDirection "${this._animation.direction}".`
    if (!advance) throw new Error(msg)
    this._period = advance(this._period, this._animation.cels.length)
  }
}
