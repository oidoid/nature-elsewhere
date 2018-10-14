import * as atlas from './atlas.js'

/**
 * @type {Readonly<
 *   Record<atlas.AnimationDirection, (cel: number, length: number) => number>
 * >}
 */
const AdvanceAnimation = {
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

/** @type {atlas.Animation} */
const nullAnimation = {cels: [], direction: atlas.AnimationDirection.FORWARD}

export default class AnimationPlayer {
  /**
   * @arg {atlas.Animation} [animation]
   * @arg {number} [cel]
   * @arg {number} [celTime]
   */
  constructor(animation = nullAnimation, cel = 0, celTime = 0) {
    /** @type {atlas.Animation} */ this._animation = animation
    /** @type {number} */ this._cel = cel
    /** @type {number} Cel exposure in milliseconds. */ this._celTime = celTime
  }

  /** @return {atlas.Cel} */
  get cel() {
    return this._animation.cels[this.celIndex]
  }

  /**
   * @arg {atlas.Animation} animation
   * @return {void}
   */
  set animation(animation) {
    if (animation === this._animation) return
    this._animation = animation
    this._cel = 0
    this._celTime = 0
  }

  /** @return {number} */
  get celIndex() {
    return Math.abs(this._cel % this._animation.cels.length)
  }

  /**
   * @arg {number} step
   * @return {void}
   */
  step(step) {
    if (this._animation.cels.length === 0) return

    const time = this._celTime + step
    const duration = this._animation.cels[this.celIndex].duration
    if (time < duration) {
      this._celTime = time
    } else {
      this._celTime = time - duration
      this._advance()
    }
  }

  /** @return {void} */
  _advance() {
    const fnc = AdvanceAnimation[this._animation.direction]
    const msg = `Unknown AnimationDirection "${this._animation.direction}".`
    if (!fnc) throw new Error(msg)
    this._cel = fnc(this._cel, this._animation.cels.length)
  }
}
