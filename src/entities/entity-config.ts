import {EntityID} from './entity-id'
import {ImageConfig} from '../images/image-config'
import {XY} from '../math/xy'

export interface EntityConfig extends Partial<XY> {
  readonly id: EntityID.Key | string
  readonly seed?: number
  readonly active?: boolean
  readonly velocity?: Partial<XY>
  readonly acceleration?: Partial<XY>
  readonly images?: ImageConfig[]
}
