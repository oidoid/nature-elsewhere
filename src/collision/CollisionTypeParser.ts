import {CollisionType} from './CollisionType'
import {ObjectUtil} from '../utils/ObjectUtil'

export type CollisionTypeKeyConfig = Maybe<CollisionType.Key | string>

export namespace CollisionTypeParser {
  export function parseKey(config: CollisionTypeKeyConfig): CollisionType {
    const type = config || 'INERT'
    if (ObjectUtil.assertValueOf(CollisionType, type, 'CollisionType.Key'))
      return type
    throw new Error()
  }
}
