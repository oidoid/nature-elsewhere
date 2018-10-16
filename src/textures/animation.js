import * as recorder from '../inputs/recorder.js'
import {Animator} from './animator.js'
import {AnimationID} from './animation-id.js'
import {Drawable} from './drawable.js'

/** @typedef {import('./player-animation.js').Atlas} Atlas */

export class Animation extends Drawable {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} [position]
   * @arg {XY} [scale]
   * @arg {XY} [scrollSpeed]
   * @arg {XY} [scrollPosition]
   */
  constructor(
    animationID,
    position = {x: 0, y: 0},
    scale = {x: 1, y: 1},
    scrollSpeed = {x: 0, y: 0},
    scrollPosition = {x: 0, y: 0}
  ) {
    super(animationID, position, scale, scrollSpeed, scrollPosition)
    /** @type {Animator} */ this._animator = new Animator()
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} _recorder
   * @return {void}
   */
  step(step, atlas, _recorder) {
    super.step(step, atlas, _recorder)
    this._animator.animation = atlas.animations[this.animationID]
    this._animator.step(step)
  }

  /** @return {Rect} */
  get bounds() {
    return this._animator.cel.bounds
  }
}
