import {AnimationID} from '../images/animation-id'
import {Animator} from '../images/animator'
import {Layer} from '../images/layer'
import {Rect} from '../math/rect'

/** Specifying a different width or height scales the target. */
export interface ImageConfig extends Partial<Rect>, Partial<Animator> {
  readonly id: AnimationID.Key | string
  readonly layer?: Layer.Key | string
  readonly sx?: number
  readonly sy?: number
  readonly tx?: number
  readonly ty?: number
  readonly tvx?: number
  readonly tvy?: number
}
