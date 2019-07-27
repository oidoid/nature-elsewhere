import {AnimationID} from '../images/animation-id'
import {Animator} from '../images/animator'
import {Layer} from '../images/layer'
import {XY} from '../math/xy'

export interface ImageConfig extends Partial<XY>, Partial<Animator> {
  readonly id: keyof typeof AnimationID | string
  readonly layer?: keyof typeof Layer | string
}
