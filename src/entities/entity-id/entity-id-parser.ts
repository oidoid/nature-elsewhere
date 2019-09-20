import {EntityID} from './entity-id'
import {EntityIDConfig} from './entity-id-config'
import {ObjectUtil} from '../../utils/object-util'

export namespace EntityIDParser {
  export function parse(config: EntityIDConfig): EntityID {
    const id = config || EntityID.ANONYMOUS
    if (ObjectUtil.hasValue(EntityID, id)) return id
    throw new Error(`Unknown EntityID "${id}".`)
  }
}
