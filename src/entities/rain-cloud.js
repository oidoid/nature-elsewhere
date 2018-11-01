import * as animatable from '../textures/animatable.js'
import * as drawable from '../textures/drawable.js'
import * as util from '../util.js'
import {AnimationID} from '../assets/animation-id.js'
import {Entity} from './entity.js'
import {Layer} from '../textures/layer.js'

export class RainCloud extends Entity {
  /**
   * @arg {AnimationID} animationID
   * @arg {XY} position
   * @arg {number} speed
   */
  constructor(animationID, {x, y}, speed) {
    super()
    /** @type {animatable.State[]} */ const animatables = []
    util.range(0, (-27 - y) / 16).forEach(i =>
      animatables.push(
        animatable.newState(
          drawable.newState(AnimationID.RAIN, {
            // Round now to prevent rain from being an extra pixel off due to
            // truncation later.
            x: x + Math.round((i + 1) / 2),
            y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
          }),
          {x: 0, y: -0.012}
        )
      )
    )

    animatables.push(
      animatable.newState(
        drawable.newState(AnimationID.WATER_M, {x: x + 1, y: -12})
      )
    )
    animatables.push(
      animatable.newState(drawable.newState(animationID, {x, y}))
    )

    this.setAnimatables(animatables)
    this.setSpeed({x: speed, y: 0})
  }

  /** @return {Layer} */
  getLayer() {
    return Layer.CLOUDS
  }
}
