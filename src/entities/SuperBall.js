import * as animation from './animation.js'
import * as atlas from './atlas.js'
import * as entity from './entity.js'

export class SuperBall extends entity.State {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super(
      entity.Type.SUPER_BALL,
      position,
      animation.ID.PALETTE_GOLD,
      entity.DrawOrder.SUPER_BALL,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  }

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
