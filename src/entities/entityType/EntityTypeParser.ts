import {ObjectUtil} from '../../utils/ObjectUtil'
import {EntityType} from './EntityType'
import {EntityTypeConfig} from './EntityTypeConfig'

export namespace EntityTypeParser {
  export function parse(config: EntityTypeConfig): EntityType {
    if (ObjectUtil.assertValueOf(EntityType, config, 'EntityType'))
      return config
    throw new Error()
  }
}
