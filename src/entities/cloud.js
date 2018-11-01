import {Animatable} from '../textures/animatable.js'
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
    this.setAnimatables([new Animatable(animationID).setPosition(position)])
    if (speed) this.setSpeed(speed)
  }

  /** @return {Layer} */
  getDrawOrder() {
    return Layer.CLOUDS
  }
}
