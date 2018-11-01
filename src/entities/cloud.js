import * as animatable from '../textures/animatable.js'
import * as drawable from '../textures/drawable.js'
import {AnimationID} from '../assets/animation-id.js'
import {Layer} from '../textures/layer.js'
import {Entity} from './entity.js'

export class Cloud extends Entity {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {XY} [speed]
   */
  constructor(animationID, position, speed) {
    super()
    this.setAnimatables([
      animatable.newState(drawable.newState(animationID, position))
    ])
    if (speed) this.setSpeed(speed)
  }

  /** @return {Layer} */
  getLayer() {
    return Layer.CLOUDS
  }
}
