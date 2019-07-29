import {EntityID} from './entity-id'
import {ImageConfig} from '../images/image-config'
import {XY} from '../math/xy'

export interface EntityConfig extends Partial<XY> {
  readonly id: EntityID.Key | string
  readonly seed?: number
  readonly active?: boolean
  readonly vx?: number
  readonly vy?: number
  readonly ax?: number
  readonly ay?: number
  readonly images?: ImageConfig[]
}
