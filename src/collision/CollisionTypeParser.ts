import {CollisionType} from './CollisionType'
import {ObjectUtil} from '../utils/ObjectUtil'

export type CollisionTypeKeyArrayConfig = Maybe<
  readonly CollisionTypeKeyConfig[]
>
export type CollisionTypeKeyConfig = Maybe<CollisionType.Key | string>

export namespace CollisionTypeParser {
  export function parseKeys(
    config: CollisionTypeKeyArrayConfig
  ): CollisionType {
    if (!config) return CollisionType.INERT
    return config.reduce(
      (type, keyConfig) => type | parseKey(keyConfig),
      CollisionType.INERT
    )
  }
  export function parseKey(config: CollisionTypeKeyConfig): CollisionType {
    const type = config || 'INERT'
    if (ObjectUtil.assertKeyOf(CollisionType, type, 'CollisionType.Key'))
      return CollisionType[type]
    throw new Error()
  }
}
