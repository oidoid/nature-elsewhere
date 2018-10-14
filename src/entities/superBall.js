import * as atlas from './atlas.js'
import * as entity from './entity.js'

export class SuperBall extends entity.State {
  /**
   * @arg {number} step
   * @arg {atlas.State} _atlas
   * @return {void}
   */
  nextStepState(step, _atlas) {
    this._position.x += step * this._speed.x
    this._position.y += step * this._speed.y
    this._scrollPosition.x += step * this.scrollSpeed.x
    this._scrollPosition.y += step * this.scrollSpeed.y
  }
}
