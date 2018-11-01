import * as animatable from '../textures/animatable.js'
import * as drawable from '../textures/drawable.js'
import {Layer} from '../textures/layer.js'
import {Entity} from './entity.js'
import {AnimationID} from '../assets/animation-id.js'

export class SuperBall extends Entity {
  /**
   * @arg {XY} position
   * @arg {XY} speed
   */
  constructor(position, speed) {
    super()
    this.setAnimatables([
      animatable.newState(
        drawable.newState(AnimationID.PALETTE_LIGHT_BLUE_TINT, position)
      )
    ])
    this.setSpeed(speed)
  }

  /** @return {Layer} */
  getLayer() {
    return Layer.SUPER_BALL
  }
}
