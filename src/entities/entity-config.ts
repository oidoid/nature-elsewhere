import {EntityID} from './entity-id'
import {ImageConfig} from '../images/image-config'

export interface EntityConfig extends Partial<XY> {
  readonly id: keyof typeof EntityID | string
  readonly seed?: number
  readonly inactive?: boolean
  readonly velocity?: Partial<XY>
  readonly acceleration?: Partial<XY>
  readonly images?: ImageConfig[]
}
