import {ObjectUtil} from '../../utils/object-util'
import {EntityType} from '../types/entity-type'
import {EntityTypeConfig} from './entity-type-config'

export namespace EntityTypeParser {
  export function parse(config: EntityTypeConfig): EntityType {
    if (ObjectUtil.isValueOf(EntityType, config)) return <EntityType>config
    throw new Error(`Unknown EntityType "${config}".`)
  }
}
