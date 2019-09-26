import {EntityID} from './EntityID'
import {ObjectUtil} from '../../utils/ObjectUtil'

export type EntityIDConfig = Maybe<EntityID | string>

export namespace EntityIDParser {
  export function parse(config: EntityIDConfig): EntityID {
    const id = config || EntityID.ANONYMOUS
    if (ObjectUtil.assertValueOf(EntityID, id, 'EntityID')) return id
    throw new Error()
  }
}
