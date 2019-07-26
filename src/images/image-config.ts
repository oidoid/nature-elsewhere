import {AnimationID} from '../images/animation-id'
import * as Animator from '../images/animator'
import {Layer} from '../images/layer'

export interface ImageConfig extends Partial<XY>, Partial<Animator.State> {
  readonly id: keyof typeof AnimationID | string
  readonly layer?: keyof typeof Layer | string
}
