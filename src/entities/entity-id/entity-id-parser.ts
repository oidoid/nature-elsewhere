import {EntityID} from './entity-id'
import {EntityIDConfig} from './entity-id-config'
import {ObjectUtil} from '../../utils/object-util'

export namespace EntityIDParser {
  export function parse(config: EntityIDConfig): EntityID {
    const id = config || EntityID.ANONYMOUS
    if (ObjectUtil.assertValueOf(EntityID, id, 'EntityID')) return id
    throw new Error()
  }
}
