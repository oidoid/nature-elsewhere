import {ObjectUtil} from '../../utils/ObjectUtil'
import {EntityType} from './EntityType'

export type EntityTypeConfig = EntityType | string

export namespace EntityTypeParser {
  export function parse(config: EntityTypeConfig): EntityType {
    if (ObjectUtil.assertValueOf(EntityType, config, 'EntityType'))
      return config
    throw new Error()
  }
}
