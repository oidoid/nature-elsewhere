import {ObjectUtil} from '../../utils/object-util'
import {EntityType} from './entity-type'
import {EntityTypeConfig} from './entity-type-config'

export namespace EntityTypeParser {
  export function parse(config: EntityTypeConfig): EntityType {
    if (ObjectUtil.assertValueOf(EntityType, config, 'EntityType'))
      return config
    throw new Error()
  }
}
