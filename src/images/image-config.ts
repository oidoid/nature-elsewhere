import {Animator} from './animator'
import {Layer} from './layer'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

export interface ImageConfig extends Partial<Rect>, Partial<Animator> {
  readonly id: string
  readonly layer?: Layer.Key | string
  readonly scale?: Partial<XY>
  readonly tx?: number
  readonly ty?: number
  readonly tvx?: number
  readonly tvy?: number
}
