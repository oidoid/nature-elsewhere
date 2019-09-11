import {EntityConfig} from './entity-config'
import {XY} from '../math/xy'
import {EntityRectBehavior} from './entity-rect-behavior'

export type EntityRectConfig = Partial<XY> & {
  readonly behavior?: EntityRectBehavior.Key | string
  readonly entities: readonly (EntityConfig | EntityRectConfig)[]
}
