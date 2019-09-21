import {EntityID} from './EntityID'
import {EntityIDConfig} from './EntityIDConfig'
import {ObjectUtil} from '../../utils/ObjectUtil'

export namespace EntityIDParser {
  export function parse(config: EntityIDConfig): EntityID {
    const id = config || EntityID.ANONYMOUS
    if (ObjectUtil.assertValueOf(EntityID, id, 'EntityID')) return id
    throw new Error()
  }
}
