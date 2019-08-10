import {ImageConfig} from '../images/image-config'
import {UpdateType} from '../store/update-type'
import {XY} from '../math/xy'
import {Behavior} from './behavior'

export interface EntityConfig extends Partial<XY> {
  readonly id?: string
  readonly state?: string
  readonly sx?: number
  readonly sy?: number
  readonly updateType?: UpdateType.Key | string
  readonly behavior?: Behavior.Key | string
  readonly vx?: number
  readonly vy?: number
  readonly ax?: number
  readonly ay?: number
  readonly images?: readonly ImageConfig[]
  readonly states?: Readonly<Record<string, readonly ImageConfig[]>>
}
