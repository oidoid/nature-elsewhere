import {Behavior} from './behavior'
import {ImageConfig} from '../images/image-config'
import {Layer} from '../images/layer'
import {Rect} from '../math/rect'
import {UpdateType} from '../store/update-type'
import {XY} from '../math/xy'

export type EntityConfig = Partial<XY> & {
  readonly id?: string
  readonly layer?: Layer.Key | string
  readonly updateType?: UpdateType.Key | string
  readonly behavior?: Behavior.Key | string
  readonly collisions?: readonly Rect[]
  readonly scale?: Partial<XY>
  readonly vx?: number
  readonly vy?: number
  readonly state?: string
  readonly states?: Readonly<Record<string, readonly ImageConfig[]>>
  readonly period?: number
}
