import * as atlas from './atlas.js'
import * as recorder from '../inputs/recorder.js'
import {Drawable} from './drawable.js'

/** @typedef {import('./player-animation.js').Atlas} Atlas */

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

export class Animation extends Drawable {
  /**
   * @arg {XY} [position]
   * @arg {XY} [scale]
   * @arg {XY} [scrollSpeed]
   * @arg {XY} [scrollPosition]
   * @arg {number} [cel]
   * @arg {number} [celTime]
   */
  constructor(
    position = {x: 0, y: 0},
    scale = {x: 1, y: 1},
    scrollSpeed = {x: 0, y: 0},
    scrollPosition = {x: 0, y: 0},
    cel = 0,
    celTime = 0
  ) {
    super(position, scale, scrollSpeed, scrollPosition)
    /** @type {number} */ this._period = cel
    /** @type {number} Cel exposure in milliseconds. */ this._celTime = celTime
  }

  /**
   * @arg {number} step
   * @arg {atlas.Animation} animation
   * @arg {recorder.ReadState} _recorder
   * @return {void}
   */
  step(step, animation, _recorder) {
    super.step(step, animation, _recorder)
    if (animation.cels.length === 0) return

    const time = this._celTime + step
    const duration = animation.cels[this._cel(animation)].duration
    if (time < duration) {
      this._celTime = time
    } else {
      this._celTime = time - duration
      this._advance(animation)
    }
  }

  /**
   * @arg {atlas.Animation} animation
   * @return {Rect}
   */
  bounds(animation) {
    return animation.cels[this._cel(animation)].bounds
  }

  /**
   * @arg {atlas.Animation} animation
   * @return {number}
   */
  _cel(animation) {
    return Math.abs(this._period % animation.cels.length)
  }

  /**
   * @arg {atlas.Animation} animation
   * @return {void}
   */
  _advance(animation) {
    const advance = Advance[animation.direction]
    const msg = `Unknown AnimationDirection "${animation.direction}".`
    if (!advance) throw new Error(msg)
    this._period = advance(this._period, animation.cels.length)
  }
}
